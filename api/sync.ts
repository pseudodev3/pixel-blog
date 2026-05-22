import { kv } from '@vercel/kv';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const USERNAME = 'ghhosttdn42';
const NITTER_INSTANCES = [
  'https://nitter.net',
  'https://xcancel.com',
  'https://nitter.poast.org',
  'https://nitter.privacydev.net'
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
  for (const instance of NITTER_INSTANCES) {
    try {
      const response = await fetch(`${instance}/${path}`, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      if (response.ok) return await response.text();
    } catch (e) {
      console.error(`Failed to fetch from ${instance}:`, e);
    }
  }
  throw new Error('All Nitter instances failed');
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

  if (!isCron && !isManual && process.env.NODE_ENV === 'production') {
    return response.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const rssText = await fetchWithFallback(`${USERNAME}/with_replies/rss`);
    
    // Simple RSS Parsing via Regex
    const itemMatches = rssText.matchAll(/<item>([\s\S]*?)<\/item>/g);
    const newTweets: Post[] = [];

    for (const match of itemMatches) {
      const itemContent = match[1];
      const title = itemContent.match(/<title>(.*?)<\/title>/)?.[1] || 'X Update';
      const link = itemContent.match(/<link>(.*?)<\/link>/)?.[1] || '';
      const pubDate = itemContent.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || '';
      const description = itemContent.match(/<description>([\s\S]*?)<\/description>/)?.[1] || '';

      const tweetId = link.split('/').pop() || '';
      const cleanContent = cleanHtml(description);
      
      const dateObj = new Date(pubDate);
      const formattedDate = isNaN(dateObj.getTime()) 
        ? new Date().toISOString().split('T')[0] 
        : dateObj.toISOString().split('T')[0];

      newTweets.push({
        id: parseInt(tweetId.substring(tweetId.length - 8)) || Date.now(),
        title: cleanHtml(title).substring(0, 50) + (title.length > 50 ? '...' : ''),
        date: formattedDate,
        category: 'X_FEED',
        excerpt: cleanContent.substring(0, 100) + (cleanContent.length > 100 ? '...' : ''),
        content: `${cleanContent}\n\n[View on X](${link.replace(/nitter\.[a-z.]+/g, 'x.com')})\n<!-- tweet_id: ${tweetId} -->`,
        icon: 'twitter'
      });
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

    const uniqueNewTweets = newTweets.filter(t => {
      const tid = t.content.match(/<!-- tweet_id: (.*?) -->/)?.[1];
      return tid && !existingTweetIds.has(tid);
    });

    if (uniqueNewTweets.length > 0) {
      const updatedPosts = [...uniqueNewTweets, ...existingPosts]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 100); // Keep last 100 posts to avoid KV bloat

      await kv.set(`${storageKey}_posts`, updatedPosts);
      return response.status(200).json({ 
        success: true, 
        added: uniqueNewTweets.length,
        total: updatedPosts.length 
      });
    }

    return response.status(200).json({ success: true, added: 0, message: 'No new tweets found' });
  } catch (error) {
    console.error('Sync error:', error);
    return response.status(500).json({ error: 'Failed to sync tweets' });
  }
}
