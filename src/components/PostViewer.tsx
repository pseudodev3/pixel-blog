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
        <button className="pixel-button" onClick={onClose} style={{ marginBottom: '4rem' }}>
          <ArrowLeft size={16} /> [RETURN_TO_BASE]
        </button>
        
        <div style={{ marginBottom: '4rem' }}>
          <motion.h1 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="neon-text-primary glitch-text" 
            data-text={post.title}
            style={{ fontSize: '2rem', marginBottom: '1.5rem', lineHeight: '1.2' }}
          >
            {post.title}
          </motion.h1>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', fontSize: '0.6rem', color: 'var(--color-secondary)', opacity: 0.7 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <Terminal size={14} /> DATE://{post.date.replace(/-/g, '.')}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
              <Gamepad2 size={14} /> NODE://{post.category}
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
              filter: (isUnlocked || isDecrypting) ? 'none' : 'blur(15px)',
              transition: 'filter 1.2s cubic-bezier(0.4, 0, 0.2, 1)',
              userSelect: isUnlocked ? 'auto' : 'none',
              pointerEvents: isUnlocked ? 'auto' : 'none',
              minHeight: '500px',
              background: 'rgba(255,255,255,0.03)',
              boxShadow: 'inset 0 0 50px rgba(0,0,0,0.5)'
            }}
          >
            {isUnlocked ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.5 }}
                style={{ whiteSpace: 'pre-wrap' }}
              >
                {post.content}
              </motion.div>
            ) : isDecrypting ? (
              <div style={{ color: 'var(--color-accent)', fontFamily: 'monospace', overflow: 'hidden' }}>
                {[...Array(25)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.15, delay: i * 0.04 }}
                    style={{ fontSize: '0.8rem', letterSpacing: '2px' }}
                  >
                    {Math.random().toString(16).substring(2, 60).toUpperCase()}
                  </motion.div>
                ))}
              </div>
            ) : (
              <div style={{ opacity: 0.3 }}>
                {post.content}
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
              background: 'rgba(0,0,0,0.85)',
              backdropFilter: 'blur(5px)'
            }}>
              <div style={{ width: '300px', height: '12px', border: '2px solid var(--color-accent)', position: 'relative', overflow: 'hidden' }}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  style={{ height: '100%', background: 'var(--color-accent)', boxShadow: '0 0 10px var(--color-accent)' }}
                />
              </div>
              <p style={{ marginTop: '1.5rem', fontSize: '0.7rem', color: 'var(--color-accent)', letterSpacing: '6px' }}>INITIALIZING_DECRYPTION_SEQ...</p>
            </div>
          )}
        </div>

        {isUnlocked && (
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
              onClick={onClose} 
              style={{ fontSize: '0.7rem' }}
            >
              CLOSE TERMINAL
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
