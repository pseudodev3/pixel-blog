import { kv } from '@vercel/kv';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (request.method !== 'GET') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const storageKey = request.query.storageKey as string || 'pixel_blog';
    const posts = await kv.get(`${storageKey}_posts`);
    
    return response.status(200).json(posts || []);
  } catch (error) {
    console.error('Fetch error:', error);
    return response.status(500).json({ error: 'Failed to fetch posts' });
  }
}
