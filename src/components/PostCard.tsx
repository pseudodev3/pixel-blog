import React from 'react'
import { motion } from 'framer-motion'
import { Terminal } from 'lucide-react'
import type { Post } from '../types'
import { audio } from '../utils/audio'

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
    whileHover={{ y: -5 }}
    onMouseEnter={() => audio.playHover()}
    className="pixel-border"
    style={{ 
      padding: '2rem', 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative',
      overflow: 'hidden'
    }}
  >
    <div className="scanline-scroll" style={{ opacity: 0.2 }} />
    
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
        <span style={{ color: 'var(--color-accent)', fontSize: '0.6rem', border: '2px solid var(--color-accent)', padding: '2px 6px' }}>
          {post.category}
        </span>
        <span style={{ color: 'var(--color-secondary)', fontSize: '0.5rem', opacity: 0.8 }}>
          TIMESTAMP: {post.date.replace(/-/g, '.')}
        </span>
      </div>
      
      <h3 className="neon-text-primary" style={{ fontSize: '1.1rem', marginBottom: '1.2rem', lineHeight: '1.4' }}>
        {post.title}
      </h3>
      
      <p style={{ fontSize: '0.7rem', color: '#ccc', marginBottom: '2rem', lineHeight: '1.6', opacity: 0.9 }}>
        {post.excerpt}
      </p>
    </div>

    <button 
      className="pixel-button" 
      onClick={() => { audio.playClick(); onRead(post); }}
      style={{ width: '100%', justifyContent: 'center' }}
    >
      {isUnlocked ? (
        <>READ</>
      ) : (
        <>DECRYPT_TRANS <Terminal size={14} style={{ marginLeft: '8px' }} /></>
      )}
    </button>
  </motion.div>
)
