import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, X, Trash2, Edit3, Plus, Download, Upload, Cpu, Zap, Terminal, Gamepad2, ChevronLeft, Save } from 'lucide-react'
import type { Post } from '../types'
import { audio } from '../utils/audio'

interface AdminTerminalProps {
  posts: Post[]
  onClose: () => void
  onSave: (post: Post) => void
  onDelete: (postId: number) => void
  onImport: (posts: Post[]) => void
  adminPassword: string
}

type AdminStep = 'auth' | 'menu' | 'write' | 'edit_select'

const ICONS = [
  { id: 'terminal', component: Terminal },
  { id: 'cpu', component: Cpu },
  { id: 'zap', component: Zap },
  { id: 'gamepad', component: Gamepad2 }
]

export const AdminTerminal = ({ posts, onClose, onSave, onDelete, onImport, adminPassword }: AdminTerminalProps) => {
  const [step, setStep] = useState<AdminStep>('auth')
  const [pass, setPass] = useState('')
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  
  // Form fields
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('USER')
  const [selectedIcon, setSelectedIcon] = useState('terminal')
  
  const [error, setError] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleAuth = () => {
    if (pass === adminPassword) {
      audio.playSuccess()
      setStep('menu')
    } else {
      audio.playError()
      setError(true)
      setTimeout(() => setError(false), 1000)
    }
  }

  const startNewPost = () => {
    audio.playClick()
    setEditingPost(null)
    setTitle('')
    setContent('')
    setCategory('USER')
    setSelectedIcon('terminal')
    setStep('write')
  }

  const startEditPost = (post: Post) => {
    audio.playClick()
    setEditingPost(post)
    setTitle(post.title)
    setContent(post.content)
    setCategory(post.category)
    setSelectedIcon(post.icon || 'terminal')
    setStep('write')
  }

  const handleSave = () => {
    if (title && content) {
      onSave({ 
        id: editingPost?.id || Date.now(), 
        title, 
        content, 
        excerpt: content.substring(0, 100) + '...', 
        date: editingPost?.date || new Date().toISOString().split('T')[0], 
        category: category || 'USER',
        icon: selectedIcon
      })
      setStep('menu')
    }
  }

  const handleExport = () => {
    audio.playClick()
    const dataStr = JSON.stringify(posts, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    const exportFileDefaultName = `pixel_blog_backup_${new Date().toISOString().split('T')[0]}.json`

    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string)
        if (Array.isArray(json)) {
          onImport(json)
          audio.playSuccess()
        }
      } catch (err) {
        audio.playError()
        console.error("Failed to import database:", err)
      }
    }
    reader.readAsText(file)
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
      <div className="pixel-border" style={{ width: '100%', maxWidth: '700px', background: '#000', padding: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2.5rem', borderBottom: '2px solid #222', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {step !== 'auth' && step !== 'menu' && (
              <ChevronLeft 
                size={20} 
                style={{ cursor: 'pointer', color: 'var(--color-primary)' }} 
                onClick={() => { audio.playClick(); setStep('menu'); }} 
              />
            )}
            <h2 className="neon-text-primary" style={{ fontSize: '1rem', letterSpacing: '4px' }}>
              {step === 'auth' ? 'SYSTEM_BIOS_AUTH' : 
               step === 'menu' ? 'MAIN_OPERATIONS_MENU' : 
               step === 'write' ? (editingPost ? 'UPDATE_TRANSMISSION' : 'NEW_TRANSMISSION') : 
               'SELECT_NODE_FOR_EDIT'}
            </h2>
          </div>
          <X style={{ cursor: 'pointer' }} onClick={() => { audio.playClick(); onClose(); }} />
        </div>
        
        <AnimatePresence mode="wait">
          {step === 'auth' ? (
            <motion.div 
              key="auth"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              style={{ textAlign: 'center' }}
            >
              <Lock size={64} style={{ marginBottom: '1.5rem', color: error ? 'red' : 'var(--color-primary)' }} />
              <p style={{ fontSize: '0.8rem', marginBottom: '1.5rem', letterSpacing: '2px' }}>ENTER ACCESS CODE_</p>
              <input 
                type="password"
                value={pass}
                autoFocus
                onChange={e => setPass(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAuth()}
                style={{ width: '100%', background: '#050505', border: '4px solid var(--color-text)', color: 'var(--color-accent)', padding: '1rem', textAlign: 'center', letterSpacing: '12px', fontSize: '1.2rem', outline: 'none' }}
              />
              {error && <p style={{ color: 'red', fontSize: '0.6rem', marginTop: '1.5rem' }}>INVALID_ACCESS_CODE_DENIED</p>}
            </motion.div>
          ) : step === 'menu' ? (
            <motion.div 
              key="menu"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}
            >
              <button className="pixel-button" onClick={startNewPost} style={{ height: '120px', flexDirection: 'column' }}>
                <Plus size={32} />
                <span style={{ marginTop: '0.5rem' }}>NEW_POST</span>
              </button>
              <button className="pixel-button" onClick={() => { audio.playClick(); setStep('edit_select'); }} style={{ height: '120px', flexDirection: 'column' }}>
                <Edit3 size={32} />
                <span style={{ marginTop: '0.5rem' }}>EDIT_EXISTING</span>
              </button>
              <button className="pixel-button" onClick={handleExport} style={{ height: '120px', flexDirection: 'column' }}>
                <Download size={32} />
                <span style={{ marginTop: '0.5rem' }}>BACKUP_DB</span>
              </button>
              <button className="pixel-button" onClick={() => { audio.playClick(); fileInputRef.current?.click(); }} style={{ height: '120px', flexDirection: 'column' }}>
                <Upload size={32} />
                <span style={{ marginTop: '0.5rem' }}>RESTORE_DB</span>
              </button>
              <input type="file" ref={fileInputRef} style={{ display: 'none' }} accept=".json" onChange={handleImport} />
            </motion.div>
          ) : step === 'edit_select' ? (
            <motion.div 
              key="edit_select"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '1rem' }}
            >
              {posts.map(post => (
                <div key={post.id} className="pixel-border" style={{ padding: '1rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.6rem', color: 'var(--color-secondary)' }}>[{post.category}] {post.date}</p>
                    <p style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{post.title}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button className="pixel-button" style={{ padding: '0.5rem' }} onClick={() => startEditPost(post)}>
                      <Edit3 size={16} />
                    </button>
                    <button className="pixel-button" style={{ padding: '0.5rem', borderColor: 'red', color: 'red' }} onClick={() => { audio.playClick(); onDelete(post.id); }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              {posts.length === 0 && <p style={{ textAlign: 'center', opacity: 0.5 }}>DATABASE_EMPTY</p>}
            </motion.div>
          ) : (
            <motion.div 
              key="write"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.6rem', marginBottom: '0.5rem', opacity: 0.7 }}>TITLE_HEADER</label>
                  <input 
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    style={{ width: '100%', background: '#050505', border: '2px solid #333', color: 'var(--color-primary)', padding: '0.8rem', fontFamily: 'inherit', fontSize: '0.8rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.6rem', marginBottom: '0.5rem', opacity: 0.7 }}>NODE_CAT</label>
                  <input 
                    value={category}
                    onChange={e => setCategory(e.target.value.toUpperCase())}
                    style={{ width: '100%', background: '#050505', border: '2px solid #333', color: 'var(--color-secondary)', padding: '0.8rem', fontFamily: 'inherit', fontSize: '0.8rem' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.6rem', marginBottom: '0.5rem', opacity: 0.7 }}>ASSIGN_ICON_MODULE</label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  {ICONS.map(icon => {
                    const IconComp = icon.component;
                    const isActive = selectedIcon === icon.id;
                    return (
                      <button 
                        key={icon.id}
                        onClick={() => { audio.playClick(); setSelectedIcon(icon.id); }}
                        style={{ 
                          padding: '0.8rem', 
                          background: isActive ? 'var(--color-primary)' : '#050505',
                          border: '2px solid #333',
                          color: isActive ? '#000' : 'var(--color-text)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <IconComp size={20} />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'block', fontSize: '0.6rem', marginBottom: '0.5rem', opacity: 0.7 }}>TRANSMISSION_CONTENT</label>
                <textarea 
                  rows={6}
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  style={{ width: '100%', background: '#050505', border: '2px solid #333', color: 'var(--color-text)', padding: '0.8rem', fontFamily: 'inherit', fontSize: '0.8rem', lineHeight: '1.6' }}
                />
              </div>
              
              <button 
                className="pixel-button" 
                style={{ width: '100%', background: 'var(--color-primary)', color: '#000' }}
                onClick={handleSave}
              >
                <Save size={18} /> {editingPost ? 'COMMIT_UPDATE' : 'UPLOAD_TO_MAINFRAME'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
