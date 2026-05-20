import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Lock, X } from 'lucide-react'
import type { Post } from '../types'

interface AdminTerminalProps {
  onClose: () => void
  onSave: (post: Post) => void
  adminPassword: string
}

export const AdminTerminal = ({ onClose, onSave, adminPassword }: AdminTerminalProps) => {
  const [step, setStep] = useState<'auth' | 'write'>('auth')
  const [pass, setPass] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('USER')
  const [error, setError] = useState(false)

  const handleAuth = () => {
    if (pass === adminPassword) setStep('write')
    else {
      setError(true)
      setTimeout(() => setError(false), 1000)
    }
  }
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        background: 'rgba(0,0,0,0.95)', zIndex: 10000, display: 'flex',
        alignItems: 'center', justifyContent: 'center', padding: '1rem'
      }}
    >
      <div className="pixel-border" style={{ width: '100%', maxWidth: '600px', background: '#000', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <h2 className="neon-text-primary" style={{ fontSize: '1rem' }}>{step === 'auth' ? 'SYSTEM_BIOS' : 'NEW_TRANS'}</h2>
          <X style={{ cursor: 'pointer' }} onClick={onClose} />
        </div>
        
        {step === 'auth' ? (
          <div style={{ textAlign: 'center' }}>
            <Lock size={48} style={{ marginBottom: '1rem', color: error ? 'red' : 'var(--color-text)' }} />
            <p style={{ fontSize: '0.7rem', marginBottom: '1rem' }}>ENTER ACCESS CODE_</p>
            <input 
              type="password"
              value={pass}
              autoFocus
              onChange={e => setPass(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAuth()}
              style={{ width: '100%', background: '#111', border: '2px solid var(--color-text)', color: 'var(--color-accent)', padding: '0.8rem', textAlign: 'center', letterSpacing: '8px' }}
            />
            {error && <p style={{ color: 'red', fontSize: '0.5rem', marginTop: '1rem' }}>INVALID ACCESS CODE</p>}
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.6rem', marginBottom: '0.5rem' }}>TITLE_</label>
              <input 
                value={title}
                onChange={e => setTitle(e.target.value)}
                style={{ width: '100%', background: '#111', border: '2px solid var(--color-text)', color: 'var(--color-primary)', padding: '0.8rem', fontFamily: 'inherit' }}
              />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.6rem', marginBottom: '0.5rem' }}>CATEGORY_</label>
              <input 
                value={category}
                onChange={e => setCategory(e.target.value.toUpperCase())}
                style={{ width: '100%', background: '#111', border: '2px solid var(--color-text)', color: 'var(--color-secondary)', padding: '0.8rem', fontFamily: 'inherit' }}
              />
            </div>
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontSize: '0.6rem', marginBottom: '0.5rem' }}>CONTENT_</label>
              <textarea 
                rows={4}
                value={content}
                onChange={e => setContent(e.target.value)}
                style={{ width: '100%', background: '#111', border: '2px solid var(--color-text)', color: 'var(--color-secondary)', padding: '0.8rem', fontFamily: 'inherit' }}
              />
            </div>
            <button 
              className="pixel-button" 
              style={{ width: '100%' }}
              onClick={() => {
                if(title && content) {
                  onSave({ 
                    title, 
                    content, 
                    excerpt: content.substring(0, 100) + '...', 
                    id: Date.now(), 
                    date: new Date().toISOString().split('T')[0], 
                    category: category || 'USER',
                    icon: undefined
                  });
                  onClose();
                }
              }}
            >
              UPLOAD TO MAIN_FRAME
            </button>
          </>
        )}
      </div>
    </motion.div>
  )
}
