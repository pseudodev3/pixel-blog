import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Github } from 'lucide-react'

interface NavbarProps {
  onOpenAdmin: () => void
  showAdmin: boolean
}

export const Navbar = ({ onOpenAdmin, showAdmin }: NavbarProps) => {
  const [isLit, setIsLit] = useState(true)
  const logoText = "PIXEL BLOG"

  const toggleLogo = (e: React.MouseEvent) => {
    // Only toggle if clicking near the logo text, 
    // but we also want the scroll to top behavior
    setIsLit(!isLit)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <nav className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2rem 1rem' }}>
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
        <motion.a
          href="https://github.com/pseudodev3"
          target="_blank"
          rel="noopener noreferrer"
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
    </nav>
  )
}
