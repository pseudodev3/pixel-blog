import { kv } from '@vercel/kv';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const BSKY_HANDLE = 'ghhosttdn42.bsky.social';
const RSS_URL = `https://bsky.app/profile/${BSKY_HANDLE}/rss`;

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
  if (!html) return '';
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .trim();
}

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  const authHeader = request.headers.authorization;
  const syncSecret = request.query.secret;
  
  const isCron = authHeader === `Bearer ${process.env.CRON_SECRET}`;
  const isManual = syncSecret === process.env.SYNC_SECRET && process.env.SYNC_SECRET !== undefined;

  if (!isCron && !isManual && process.env.NODE_ENV === 'production') {
    return response.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const res = await fetch(RSS_URL, {
      headers: { 'User-Agent': 'Mozilla/5.0 (PixelBlog Sync Engine)' }
    });

    if (!res.ok) {
      throw new Error(`Bluesky RSS returned ${res.status}`);
    }

    const rssText = await res.text();
    const items: Post[] = [];
    
    // Bluesky uses standard RSS <item> tags
    const itemMatches = rssText.matchAll(/<item>([\s\S]*?)<\/item>/g);

    for (const match of itemMatches) {
      const itemContent = match[1];
      const title = itemContent.match(/<title>(.*?)<\/title>/)?.[1] || 'New Transmission';
      const link = itemContent.match(/<link>(.*?)<\/link>/)?.[1] || '';
      const pubDate = itemContent.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || '';
      const description = itemContent.match(/<description>([\s\S]*?)<\/description>/)?.[1] || '';

      // Bluesky IDs are usually at the end of the URL (at://...)
      const bskyId = link.split('/').pop() || Math.random().toString(36).substring(7);
      const cleanContent = cleanHtml(description.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1'));
      
      const dateObj = new Date(pubDate);
      const formattedDate = isNaN(dateObj.getTime()) 
        ? new Date().toISOString().split('T')[0] 
        : dateObj.toISOString().split('T')[0];

      // Create a unique numeric ID from the bsky string hash
      let hash = 0;
      for (let i = 0; i < bskyId.length; i++) {
        hash = ((hash << 5) - hash) + bskyId.charCodeAt(i);
        hash |= 0;
      }

      items.push({
        id: Math.abs(hash),
        title: cleanHtml(title).substring(0, 50) + (title.length > 50 ? '...' : ''),
        date: formattedDate,
        category: 'BSKY_FEED',
        excerpt: cleanContent.substring(0, 100) + (cleanContent.length > 100 ? '...' : ''),
        content: `${cleanContent}\n\n[View on Bluesky](${link})\n<!-- bsky_id: ${bskyId} -->`,
        icon: 'cloud' // Using 'cloud' as a placeholder for Bluesky butterfly
      });
    }

    if (items.length === 0) {
      return response.status(200).json({ success: true, added: 0, message: 'No posts found' });
    }

    const storageKey = 'pixel_blog';
    const existingPosts = await kv.get<Post[]>(`${storageKey}_posts`) || [];
    
    const existingIds = new Set(
      existingPosts
        .map(p => p.content.match(/<!-- bsky_id: (.*?) -->/)?.[1])
        .filter(Boolean)
    );

    const uniqueNewItems = items.filter(t => {
      const bid = t.content.match(/<!-- bsky_id: (.*?) -->/)?.[1];
      return bid && !existingIds.has(bid);
    });

    if (uniqueNewItems.length > 0) {
      const updatedPosts = [...uniqueNewItems, ...existingPosts]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 100); 

      await kv.set(`${storageKey}_posts`, updatedPosts);
      return response.status(200).json({ success: true, added: uniqueNewItems.length, total: updatedPosts.length });
    }

    return response.status(200).json({ success: true, added: 0, message: 'Already synced' });
  } catch (error) {
    console.error('Sync error:', error);
    return response.status(500).json({ error: 'Sync failed', details: error instanceof Error ? error.message : 'Unknown' });
  }
}
