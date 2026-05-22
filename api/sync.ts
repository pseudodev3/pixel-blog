import { kv } from '@vercel/kv';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const USERNAME = 'ghhosttdn42';
const NITTER_INSTANCES = [
  'https://nitter.privacydev.net',
  'https://nitter.lacontrevoie.fr',
  'https://nitter.moomoo.me',
  'https://nitter.mint.lgbt',
  'https://xcancel.com'
];

const RSS_BRIDGE_INSTANCES = [
  'https://wtf.roflcopter.fr/rss-bridge',
  'https://rss-bridge.org/bridge01',
  'https://rss-bridge.lewd.tech',
  'https://rb.vern.cc'
];

interface Post {
  id: number;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  content: string;
  icon?: string;
}

function cleanHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}

async function fetchWithFallback(path: string) {
  const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
  ];

  const headers = { 
    'User-Agent': userAgents[Math.floor(Math.random() * userAgents.length)],
    'Accept': 'application/rss+xml, application/xml, text/xml',
    'Accept-Language': 'en-US,en;q=0.9'
  };

  // Try Nitter Direct first
  for (const instance of NITTER_INSTANCES) {
    try {
      const response = await fetch(`${instance}/${path}`, { headers });
      if (response.ok) {
        const text = await response.text();
        if ((text.includes('<rss') || text.includes('<feed')) && !text.includes('whitelist')) {
          return text;
        }
      }
    } catch (e) { console.warn(`Nitter ${instance} failed`); }
  }

  // Fallback to RSS-Bridge
  for (const instance of RSS_BRIDGE_INSTANCES) {
    try {
      const bridgeUrl = `${instance}/?action=display&bridge=TwitterBridge&context=By+username&user=${USERNAME}&format=Atom`;
      const response = await fetch(bridgeUrl, { headers });
      if (response.ok) {
        const text = await response.text();
        if (text.includes('<rss') || text.includes('<feed')) return text;
      }
      
      // Try NitterBridge via RSS-Bridge as well
      const nitterBridgeUrl = `${instance}/?action=display&bridge=NitterBridge&username=${USERNAME}&format=Atom`;
      const nitterRes = await fetch(nitterBridgeUrl, { headers });
      if (nitterRes.ok) {
        const text = await nitterRes.text();
        if (text.includes('<rss') || text.includes('<feed')) return text;
      }
    } catch (e) { console.warn(`RSS-Bridge ${instance} failed`); }
  }

  throw new Error('All sync vectors (Nitter & RSS-Bridge) failed');
}

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  // Allow Vercel Cron or manual trigger with secret
  const authHeader = request.headers.authorization;
  const syncSecret = request.query.secret;
  
  const isCron = authHeader === `Bearer ${process.env.CRON_SECRET}`;
  const isManual = syncSecret === process.env.SYNC_SECRET && process.env.SYNC_SECRET !== undefined;

  // In development, allow bypass
  if (!isCron && !isManual && process.env.NODE_ENV === 'production') {
    return response.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const rssText = await fetchWithFallback(`${USERNAME}/with_replies/rss`);
    
    // Improved Regex Parsing for both RSS and Atom
    const items: Post[] = [];
    
    // Try RSS <item> first
    const itemMatches = rssText.matchAll(/<(item|entry)>([\s\S]*?)<\/(item|entry)>/g);

    for (const match of itemMatches) {
      const itemContent = match[2];
      const title = itemContent.match(/<title>(.*?)<\/title>/)?.[1] || 'X Update';
      const link = itemContent.match(/<link[^>]*?href="(.*?)"/)?.[1] || itemContent.match(/<link>(.*?)<\/link>/)?.[1] || '';
      const pubDate = itemContent.match(/<(pubDate|updated)>(.*?)<\/(pubDate|updated)>/)?.[2] || '';
      const description = itemContent.match(/<(description|content|summary)[\s\S]*?>([\s\S]*?)<\/(description|content|summary)>/)?.[2] || '';

      const tweetId = link.split('/').pop() || Math.random().toString(36).substring(7);
      const cleanContent = cleanHtml(description.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1'));
      
      const dateObj = new Date(pubDate);
      const formattedDate = isNaN(dateObj.getTime()) 
        ? new Date().toISOString().split('T')[0] 
        : dateObj.toISOString().split('T')[0];

      items.push({
        id: parseInt(tweetId.substring(tweetId.length - 10)) || Date.now() + Math.floor(Math.random() * 1000),
        title: cleanHtml(title).substring(0, 50) + (title.length > 50 ? '...' : ''),
        date: formattedDate,
        category: 'X_FEED',
        excerpt: cleanContent.substring(0, 100) + (cleanContent.length > 100 ? '...' : ''),
        content: `${cleanContent}\n\n[View on X](${link.replace(/nitter\.[a-z.]+/g, 'x.com').replace(/xcancel\.com/g, 'x.com')})\n<!-- tweet_id: ${tweetId} -->`,
        icon: 'twitter'
      });
    }

    if (items.length === 0) {
      return response.status(200).json({ success: true, added: 0, message: 'No items found in feed' });
    }

    // Get existing posts
    const storageKey = 'pixel_blog';
    const existingPosts = await kv.get<Post[]>(`${storageKey}_posts`) || [];
    
    // Merge and deduplicate
    const existingTweetIds = new Set(
      existingPosts
        .map(p => p.content.match(/<!-- tweet_id: (.*?) -->/)?.[1])
        .filter(Boolean)
    );

    const uniqueNewItems = items.filter(t => {
      const tid = t.content.match(/<!-- tweet_id: (.*?) -->/)?.[1];
      return tid && !existingTweetIds.has(tid);
    });

    if (uniqueNewItems.length > 0) {
      const updatedPosts = [...uniqueNewItems, ...existingPosts]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 100); 

      await kv.set(`${storageKey}_posts`, updatedPosts);
      return response.status(200).json({ 
        success: true, 
        added: uniqueNewItems.length,
        total: updatedPosts.length 
      });
    }

    return response.status(200).json({ success: true, added: 0, message: 'All items already synced' });
  } catch (error) {
    console.error('Sync error:', error);
    return response.status(500).json({ error: 'Failed to sync tweets', details: error instanceof Error ? error.message : 'Unknown error' });
  }
}
