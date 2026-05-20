import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Terminal, Gamepad2, ArrowLeft, AlertTriangle } from 'lucide-react'
import type { Post } from '../types'

interface PostViewerProps {
  post: Post
  onClose: () => void
  isUnlocked: boolean
  onUnlock: () => void
}

export const PostViewer = ({ post, onClose, isUnlocked, onUnlock }: PostViewerProps) => {
  const [isDecrypting, setIsDecrypting] = useState(!isUnlocked)
  
  useEffect(() => {
    if (!isUnlocked) {
      const timer = setTimeout(() => {
        onUnlock()
        setIsDecrypting(false)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [isUnlocked, onUnlock])

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        background: 'var(--color-bg)', zIndex: 9000, overflowY: 'auto', padding: '1rem'
      }}
    >
      <div className="container" style={{ position: 'relative', padding: '1rem' }}>
        <button className="pixel-button" onClick={onClose} style={{ marginBottom: '2rem' }}>
          <ArrowLeft size={16} /> BACK
        </button>
        
        <div style={{ marginBottom: '2rem' }}>
          <motion.h1 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="neon-text-primary" 
            style={{ fontSize: '1.4rem', marginBottom: '1rem', lineHeight: '1.3' }}
          >
            {post.title}
          </motion.h1>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.6rem', color: 'var(--color-secondary)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Terminal size={14} /> {post.date}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Gamepad2 size={14} /> {post.category}
            </span>
          </div>
        </div>
        
        <div style={{ position: 'relative' }}>
          <div 
            className="pixel-border" 
            style={{ 
              padding: '2.5rem', 
              lineHeight: '1.8', 
              fontSize: '0.9rem',
              filter: (isUnlocked || isDecrypting) ? 'none' : 'blur(12px)',
              transition: 'filter 0.8s ease',
              userSelect: isUnlocked ? 'auto' : 'none',
              pointerEvents: isUnlocked ? 'auto' : 'none',
              minHeight: '400px',
              background: 'rgba(255,255,255,0.02)'
            }}
          >
            {isUnlocked ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
              >
                {post.content}
              </motion.div>
            ) : isDecrypting ? (
              <div style={{ color: 'var(--color-accent)', fontFamily: 'monospace' }}>
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.1, delay: i * 0.05 }}
                  >
                    {Math.random().toString(16).substring(2, 40)}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div style={{ opacity: 0.5 }}>
                {post.content}
                <div style={{ marginTop: '2rem' }}>
                  {[...Array(8)].map((_, i) => (
                    <div key={i} style={{ height: '1.2rem', background: '#222', marginBottom: '0.8rem', width: `${Math.random() * 40 + 60}%` }} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {isDecrypting && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 20,
              background: 'rgba(0,0,0,0.8)'
            }}>
              <div style={{ width: '300px', height: '30px', border: '4px solid var(--color-accent)', position: 'relative' }}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.5, ease: "linear" }}
                  style={{ height: '100%', background: 'var(--color-accent)' }}
                />
              </div>
              <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--color-accent)', letterSpacing: '4px' }}>DECRYPTING_DATA...</p>
            </div>
          )}
        </div>

        {isUnlocked && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ marginTop: '4rem', textAlign: 'center', borderTop: '4px solid #222', padding: '2rem' }}
          >
            <AlertTriangle size={24} style={{ color: 'var(--color-accent)', marginBottom: '1rem' }} />
            <p style={{ fontSize: '0.6rem', color: 'var(--color-accent)', letterSpacing: '4px' }}>END OF ENCRYPTED TRANSMISSION</p>
            <button 
              className="pixel-button" 
              onClick={onClose} 
              style={{ marginTop: '2rem', fontSize: '0.6rem' }}
            >
              RETURN TO TERMINAL
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
