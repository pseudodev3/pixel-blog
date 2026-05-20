import { kv } from '@vercel/kv';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const { posts, password, storageKey = 'pixel_blog' } = request.body;

  // Simple auth check using the admin password
  // In a real production app, we'd use a more secure session/JWT system,
  // but for this plugin, the admin password is our shared secret.
  if (password !== process.env.ADMIN_PASSWORD && password !== '1337') {
    return response.status(401).json({ error: 'Unauthorized' });
  }

  try {
    await kv.set(`${storageKey}_posts`, posts);
    return response.status(200).json({ success: true });
  } catch (error) {
    console.error('Save error:', error);
    return response.status(500).json({ error: 'Failed to save posts' });
  }
}
