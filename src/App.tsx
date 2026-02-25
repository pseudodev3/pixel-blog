import { motion, AnimatePresence } from 'framer-motion'
import { Terminal, Gamepad2, Cpu, Zap, Lock, Unlock, Plus, X } from 'lucide-react'
import { useState, useEffect } from 'react'

const INITIAL_POSTS = [
  {
    id: 1,
    title: "Level 1: The Pixel Revolution",
    date: "2026-02-26",
    category: "Graphics",
    excerpt: "Why low-res is high-fidelity for the soul. Exploring the aesthetic of limitations.",
    icon: <Cpu size={24} />
  },
  {
    id: 2,
    title: "Optimization as an Art Form",
    date: "2026-02-25",
    category: "Code",
    excerpt: "Squeezing every cycle out of the CPU. A deep dive into assembly-style thinking.",
    icon: <Zap size={24} />
  }
]

const CRTOverlay = () => (
  <>
    <div className="crt-overlay" />
    <div className="crt-flicker" />
  </>
)

const Navbar = ({ onOpenAdmin, isUnlocked }: { onOpenAdmin: () => void, isUnlocked: boolean }) => (
  <nav className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2rem 1rem' }}>
    <motion.div 
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="neon-text-primary"
      style={{ fontSize: '1.2rem', fontWeight: 'bold' }}
    >
      PIXEL_LOG
    </motion.div>
    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
      {['Posts', 'About'].map((item, i) => (
        <motion.a
          key={item}
          href="#"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: i * 0.1 }}
          style={{ color: 'var(--color-text)', textDecoration: 'none', fontSize: '0.7rem' }}
          className="glitch-text"
        >
          {item}
        </motion.a>
      ))}
      {isUnlocked && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={onOpenAdmin}
          className="pixel-button"
          style={{ padding: '0.5rem', background: 'var(--color-accent)', color: '#000' }}
        >
          <Plus size={16} />
        </motion.button>
      )}
    </div>
  </nav>
)

const PostCard = ({ post, index }: { post: any, index: number }) => (
  <motion.div
    initial={{ x: index % 2 === 0 ? -50 : 50, opacity: 0 }}
    whileInView={{ x: 0, opacity: 1 }}
    viewport={{ once: true }}
    transition={{ type: 'spring', damping: 12 }}
    className="pixel-border"
    style={{ padding: '1.5rem', marginBottom: '2rem', cursor: 'pointer' }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
      <span style={{ color: 'var(--color-accent)', fontSize: '0.6rem' }}>[{post.category}]</span>
      <span style={{ color: 'var(--color-secondary)', fontSize: '0.6rem' }}>{post.date}</span>
    </div>
    <h3 className="neon-text-primary" style={{ fontSize: '1rem', marginBottom: '1rem' }}>{post.title}</h3>
    <p style={{ fontSize: '0.7rem', color: '#aaa', marginBottom: '1.5rem' }}>{post.excerpt}</p>
    <button className="pixel-button">
      Read More <Terminal size={14} />
    </button>
  </motion.div>
)

const AdminTerminal = ({ onClose, onSave }: { onClose: () => void, onSave: (post: any) => void }) => {
  const [title, setTitle] = useState('')
  const [excerpt, setExcerpt] = useState('')
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        background: 'rgba(0,0,0,0.9)', zIndex: 10000, display: 'flex',
        alignItems: 'center', justifyContent: 'center', padding: '1rem'
      }}
    >
      <div className="pixel-border" style={{ width: '100%', maxWidth: '600px', background: '#000', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <h2 className="neon-text-primary" style={{ fontSize: '1rem' }}>NEW TRANSMISSION</h2>
          <X style={{ cursor: 'pointer' }} onClick={onClose} />
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.6rem', marginBottom: '0.5rem' }}>TITLE_</label>
          <input 
            value={title}
            onChange={e => setTitle(e.target.value)}
            style={{ width: '100%', background: '#111', border: '2px solid var(--color-text)', color: 'var(--color-primary)', padding: '0.8rem', fontFamily: 'inherit' }}
          />
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <label style={{ display: 'block', fontSize: '0.6rem', marginBottom: '0.5rem' }}>CONTENT_</label>
          <textarea 
            rows={4}
            value={excerpt}
            onChange={e => setExcerpt(e.target.value)}
            style={{ width: '100%', background: '#111', border: '2px solid var(--color-text)', color: 'var(--color-secondary)', padding: '0.8rem', fontFamily: 'inherit' }}
          />
        </div>

        <button 
          className="pixel-button" 
          style={{ width: '100%' }}
          onClick={() => {
            if(title && excerpt) {
              onSave({ title, excerpt, id: Date.now(), date: new Date().toISOString().split('T')[0], category: 'USER' });
              onClose();
            }
          }}
        >
          UPLOAD TO MAIN_FRAME
        </button>
      </div>
    </motion.div>
  )
}

export default function App() {
  const [coins, setCoins] = useState(0)
  const [posts, setPosts] = useState<any[]>([])
  const [isAdminOpen, setIsAdminOpen] = useState(false)
  const [showSecretMsg, setShowSecretMsg] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('pixel_posts')
    if (saved) setPosts(JSON.parse(saved))
    else setPosts(INITIAL_POSTS)
  }, [])

  useEffect(() => {
    if (coins === 3) {
      setShowSecretMsg(true)
      setTimeout(() => setShowSecretMsg(false), 3000)
    }
  }, [coins])

  const savePost = (newPost: any) => {
    const updated = [newPost, ...posts]
    setPosts(updated)
    localStorage.setItem('pixel_posts', JSON.stringify(updated))
  }

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <CRTOverlay />
      
      <AnimatePresence>
        {isAdminOpen && (
          <AdminTerminal onClose={() => setIsAdminOpen(false)} onSave={savePost} />
        )}
      </AnimatePresence>

      <Navbar onOpenAdmin={() => setIsAdminOpen(true)} isUnlocked={coins >= 3} />

      <main className="container">
        <header style={{ textAlign: 'center', padding: '4rem 0' }}>
          <motion.h1 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="neon-text-primary"
            style={{ fontSize: '2.5rem', marginBottom: '1rem' }}
          >
            PIXEL BLOG
          </motion.h1>
          
          <div style={{ height: '2rem', marginBottom: '1rem' }}>
            <AnimatePresence mode="wait">
              {showSecretMsg ? (
                <motion.p
                  key="secret"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  style={{ fontSize: '0.8rem', color: 'var(--color-accent)' }}
                >
                  !!! SECRET UNLOCKED: ADMIN ACCESS GRANTED !!!
                </motion.p>
              ) : (
                <motion.p
                  key="score"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ fontSize: '0.8rem', color: 'var(--color-secondary)' }}
                >
                  HIGH SCORE: {coins * 1000} | CREDITS: {coins}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
          
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <button 
              className="pixel-button" 
              onClick={() => setCoins(c => c + 1)}
              style={{ padding: '1.5rem 3rem', fontSize: '1rem', position: 'relative' }}
            >
              {coins < 3 ? `INSERT COIN (${3-coins} LEFT)` : 'INSERT COIN'}
              {coins < 3 ? <Lock size={16} style={{ marginLeft: '10px' }} /> : <Unlock size={16} style={{ marginLeft: '10px' }} />}
            </button>
          </motion.div>
        </header>

        <section style={{ marginTop: '4rem' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '2rem', borderBottom: '4px solid var(--color-primary)', display: 'inline-block' }}>
            Latest Transmission
          </h2>
          {posts.map((post, i) => (
            <PostCard key={post.id} post={post} index={i} />
          ))}
        </section>
      </main>

      <footer className="container" style={{ textAlign: 'center', padding: '4rem 0', fontSize: '0.6rem', color: '#666' }}>
        <p>© 2026 PIXEL_LOG ENGINE. ALL RIGHTS RESERVED.</p>
        <p style={{ marginTop: '1rem' }}>MADE WITH 8-BIT PASSION</p>
      </footer>
    </div>
  )
}
