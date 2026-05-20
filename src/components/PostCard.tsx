import React from 'react'
import { motion } from 'framer-motion'
import { Terminal, Unlock } from 'lucide-react'
import type { Post } from '../types'

interface PostCardProps {
  post: Post
  onRead: (post: Post) => void
  isUnlocked: boolean
}

export const PostCard = ({ post, onRead, isUnlocked }: PostCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="pixel-border"
    style={{ padding: '1.5rem', marginBottom: '2rem' }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
      <span style={{ color: 'var(--color-accent)', fontSize: '0.6rem' }}>[{post.category}]</span>
      <span style={{ color: 'var(--color-secondary)', fontSize: '0.6rem' }}>{post.date}</span>
    </div>
    <h3 className="neon-text-primary" style={{ fontSize: '1rem', marginBottom: '1rem' }}>{post.title}</h3>
    <p style={{ fontSize: '0.7rem', color: '#aaa', marginBottom: '1.5rem' }}>{post.excerpt}</p>
    <button className="pixel-button" onClick={() => onRead(post)}>
      {isUnlocked ? (
        <>READ MORE <Unlock size={12} style={{ color: 'var(--color-secondary)' }} /></>
      ) : (
        <>READ MORE <Terminal size={12} style={{ marginLeft: '8px' }} /></>
      )}
    </button>
  </motion.div>
)
