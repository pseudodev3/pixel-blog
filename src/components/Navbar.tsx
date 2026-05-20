import React from 'react'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'

interface NavbarProps {
  onOpenAdmin: () => void
  showAdmin: boolean
}

export const Navbar = ({ onOpenAdmin, showAdmin }: NavbarProps) => (
  <nav className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2rem 1rem' }}>
    <motion.div 
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="hotel-logo"
      style={{ cursor: 'pointer' }}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      PIXEL BLOG
    </motion.div>
    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
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
