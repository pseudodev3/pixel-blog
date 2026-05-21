import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Terminal, Gamepad2, ArrowLeft, AlertTriangle } from 'lucide-react'
import type { Post } from '../types'
import { audio } from '../utils/audio'

interface PostViewerProps {
  post: Post
  onClose: () => void
}

export const PostViewer = ({ post, onClose }: PostViewerProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        background: 'var(--color-bg)', zIndex: 9000, overflowY: 'auto', padding: '0'
      }}
    >
      <div className="scanline-scroll" style={{ opacity: 0.1, zIndex: 1 }} />
      
      <div className="container" style={{ position: 'relative', padding: '4rem 2rem', zIndex: 2 }}>
        <button className="pixel-button" onClick={() => { audio.playClick(); onClose(); }} style={{ marginBottom: '4rem' }}>
          <ArrowLeft size={16} /> [RETURN_TO_BASE]
        </button>
        
        <div style={{ marginBottom: '4rem', position: 'relative' }}>
          <motion.h1 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="neon-text-primary pixel-shimmer" 
            style={{ fontSize: '2.5rem', marginBottom: '1.5rem', lineHeight: '1.1', display: 'inline-block', paddingRight: '2rem' }}
          >
            {post.title}
          </motion.h1>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', fontSize: '0.6rem', color: 'var(--color-secondary)', opacity: 0.7, borderTop: '2px solid #111', paddingTop: '1.5rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <Terminal size={14} /> DATE: {post.date.replace(/-/g, '.')}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <Gamepad2 size={14} /> NODE: {post.category}
            </span>
          </div>
        </div>

        
        <div style={{ position: 'relative' }}>
          <div 
            className="pixel-border" 
            style={{ 
              padding: '4rem', 
              lineHeight: '2', 
              fontSize: '1rem',
              minHeight: '500px',
              background: 'rgba(255,255,255,0.03)'
            }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
              style={{ whiteSpace: 'pre-wrap' }}
            >
              {post.content}
            </motion.div>
          </div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          style={{ marginTop: '6rem', textAlign: 'center', borderTop: '4px solid #1a1a1a', padding: '4rem' }}
        >
          <AlertTriangle size={32} style={{ color: 'var(--color-accent)', marginBottom: '1.5rem', opacity: 0.8 }} />
          <p style={{ fontSize: '0.6rem', color: 'var(--color-accent)', letterSpacing: '6px', marginBottom: '3rem' }}>--- END OF TRANSMISSION ---</p>
          <button 
            className="pixel-button" 
            onClick={() => { audio.playClick(); onClose(); }} 
            style={{ fontSize: '0.7rem' }}
          >
            CLOSE TERMINAL
          </button>
        </motion.div>
      </div>
    </motion.div>
  )
}
