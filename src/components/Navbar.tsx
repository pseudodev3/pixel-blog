import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Github, Search, Volume2, VolumeX, ChevronDown } from 'lucide-react'
import { audio } from '../utils/audio'

interface NavbarProps {
  onOpenAdmin: () => void
  showAdmin: boolean
  searchQuery: string
  setSearchQuery: (query: string) => void
  activeCategory: string | null
  setActiveCategory: (cat: string | null) => void
  categories: string[]
  isAudioEnabled: boolean
  setIsAudioEnabled: (enabled: boolean) => void
}

export const Navbar = ({ 
  onOpenAdmin, 
  showAdmin,
  searchQuery,
  setSearchQuery,
  activeCategory,
  setActiveCategory,
  categories,
  isAudioEnabled,
  setIsAudioEnabled
}: NavbarProps) => {
  const [isLit, setIsLit] = useState(true)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const logoText = "PIXEL BLOG"

  const toggleLogo = (e: React.MouseEvent) => {
    audio.playClick()
    setIsLit(!isLit)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCategoryClick = (cat: string | null) => {
    audio.playClick()
    setActiveCategory(cat)
    setIsFilterOpen(false)
  }

  return (
    <nav className="container" style={{ padding: '2rem 1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <motion.div 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className={`hotel-logo ${!isLit ? 'unlit' : ''}`}
          style={{ cursor: 'pointer', userSelect: 'none' }}
          onClick={toggleLogo}
        >
          {logoText.split('').map((char, i) => (
            <span 
              key={i} 
              className={`flicker-${(i % 3) + 1}`}
              style={{ 
                display: char === ' ' ? 'inline-block' : 'inline', 
                width: char === ' ' ? '1rem' : 'auto' 
              }}
            >
              {char}
            </span>
          ))}
        </motion.div>
        
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <button 
            onClick={() => { audio.playClick(); setIsAudioEnabled(!isAudioEnabled); }}
            style={{ background: 'none', border: 'none', color: 'var(--color-text)', cursor: 'pointer', opacity: 0.7 }}
          >
            {isAudioEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
          
          <motion.a
            href="https://github.com/pseudodev3"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => audio.playHover()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.1, color: 'var(--color-primary)' }}
            style={{ color: 'var(--color-text)', display: 'flex', alignItems: 'center' }}
          >
            <Github size={20} />
          </motion.a>
          
          {showAdmin && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{ scale: 1.1, color: 'var(--color-primary)' }}
              onClick={onOpenAdmin}
              onMouseEnter={() => audio.playHover()}
              style={{ 
                background: 'none', 
                border: 'none', 
                color: 'var(--color-text)', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Plus size={20} />
            </motion.button>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search size={14} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
          <input 
            type="text"
            placeholder="SEARCH_DATABASE..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              width: '100%', 
              background: 'rgba(255,255,255,0.05)', 
              border: '2px solid #333', 
              color: 'var(--color-text)', 
              padding: '0.8rem 1rem 0.8rem 2.5rem',
              fontFamily: 'inherit',
              fontSize: '0.7rem'
            }}
          />
        </div>
        
        <div style={{ position: 'relative' }}>
          <button 
            className="pixel-button"
            onClick={() => { audio.playClick(); setIsFilterOpen(!isFilterOpen); }}
            style={{ padding: '0.8rem 1.2rem', fontSize: '0.6rem' }}
          >
            {activeCategory || 'ALL_CATEGORIES'} <ChevronDown size={14} />
          </button>
          
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="pixel-border"
                style={{ 
                  position: 'absolute', 
                  top: '110%', 
                  right: 0, 
                  zIndex: 100, 
                  minWidth: '200px',
                  background: '#000',
                  padding: '0.5rem'
                }}
              >
                <div 
                  onClick={() => handleCategoryClick(null)}
                  style={{ padding: '0.8rem', fontSize: '0.6rem', cursor: 'pointer', color: !activeCategory ? 'var(--color-primary)' : 'inherit' }}
                >
                  [ALL_NODES]
                </div>
                {categories.map(cat => (
                  <div 
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    style={{ padding: '0.8rem', fontSize: '0.6rem', cursor: 'pointer', color: activeCategory === cat ? 'var(--color-primary)' : 'inherit' }}
                  >
                    {cat.toUpperCase()}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  )
}
