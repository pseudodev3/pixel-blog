import { motion, AnimatePresence } from 'framer-motion'
import { Terminal, Gamepad2, Cpu, Zap, Lock, Unlock, Plus, X, ArrowLeft, AlertTriangle } from 'lucide-react'
import { useState, useEffect } from 'react'

const INITIAL_POSTS = [
  {
    id: 1,
    title: "Level 1: The Pixel Revolution",
    date: "2026-02-26",
    category: "Graphics",
    excerpt: "Why low-res is high-fidelity for the soul. Exploring the aesthetic of limitations.",
    content: "In an age of 4K and photorealism, the pixel remains the fundamental unit of digital soul. By limiting our palette and resolution, we force the viewer's imagination to fill the gaps. This is the 'Uncanny Valley' in reverse—instead of being creeped out by almost-real faces, we are charmed by obviously-fake ones. Low-res isn't a limitation; it's a stylistic choice that prioritizes essence over detail.",
    icon: <Cpu size={24} />
  },
  {
    id: 2,
    title: "Optimization as an Art Form",
    date: "2026-02-25",
    category: "Code",
    excerpt: "Squeezing every cycle out of the CPU. A deep dive into assembly-style thinking.",
    content: "The programmers of the 80s were wizards. They didn't have gigabytes of RAM; they had kilobytes. Every byte was a battle. Modern web development has grown bloated, but we can still apply those lessons. Lazy loading, tree shaking, and efficient state management are the modern versions of bank-switching and sprite multiplexing. Treat your user's CPU with respect.",
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

const PostCard = ({ post, onRead }: { post: any, onRead: (post: any) => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="pixel-border"
    style={{ padding: '1.5rem', marginBottom: '2rem' }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
      <span style={{ color: 'var(--color-accent)', fontSize: '0.6rem' }}>[{post.category}]</span>
      <span style={{ color: 'var(--color-secondary)', fontSize: '0.6rem' }}>{post.date}</span>
    </div>
    <h3 className="neon-text-primary" style={{ fontSize: '1rem', marginBottom: '1rem' }}>{post.title}</h3>
    <p style={{ fontSize: '0.7rem', color: '#aaa', marginBottom: '1.5rem' }}>{post.excerpt}</p>
    <button className="pixel-button" onClick={() => onRead(post)}>
      READ MORE <span style={{ fontSize: '0.5rem', marginLeft: '8px', color: 'var(--color-accent)' }}>(COST: 1 CR)</span>
    </button>
  </motion.div>
)

const PostViewer = ({ post, onClose }: { post: any, onClose: () => void }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 1.1 }}
    style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      background: 'var(--color-bg)', zIndex: 9000, overflowY: 'auto', padding: '2rem 1rem'
    }}
  >
    <div className="container">
      <button className="pixel-button" onClick={onClose} style={{ marginBottom: '2rem' }}>
        <ArrowLeft size={16} /> BACK TO MENU
      </button>
      <h1 className="neon-text-primary" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{post.title}</h1>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', fontSize: '0.6rem', color: 'var(--color-secondary)' }}>
        <span>DATE: {post.date}</span>
        <span>CAT: {post.category}</span>
      </div>
      <div className="pixel-border" style={{ padding: '2rem', lineHeight: '2', fontSize: '0.8rem' }}>
        {post.content}
      </div>
      <div style={{ marginTop: '3rem', textAlign: 'center' }}>
        <p style={{ fontSize: '0.6rem', color: 'var(--color-accent)' }}>--- END OF TRANSMISSION ---</p>
      </div>
    </div>
  </motion.div>
)

const AdminTerminal = ({ onClose, onSave }: { onClose: () => void, onSave: (post: any) => void }) => {
  const [step, setStep] = useState<'auth' | 'write'>('auth')
  const [pass, setPass] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState(false)

  const handleAuth = () => {
    if (pass === '1337') setStep('write')
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
                  onSave({ title, content, excerpt: content.substring(0, 100) + '...', id: Date.now(), date: new Date().toISOString().split('T')[0], category: 'USER' });
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

export default function App() {
  const [coins, setCoins] = useState(0)
  const [posts, setPosts] = useState<any[]>([])
  const [isAdminOpen, setIsAdminOpen] = useState(false)
  const [activePost, setActivePost] = useState<any>(null)
  const [msg, setMsg] = useState<{ text: string, type: 'secret' | 'error' } | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('pixel_posts')
    if (saved) setPosts(JSON.parse(saved))
    else setPosts(INITIAL_POSTS)
  }, [])

  const triggerMsg = (text: string, type: 'secret' | 'error') => {
    setMsg({ text, type })
    setTimeout(() => setMsg(null), 2500)
  }

  const handleRead = (post: any) => {
    if (coins >= 1) {
      setCoins(c => c - 1)
      setActivePost(post)
    } else {
      triggerMsg("!!! INSUFFICIENT CREDITS: INSERT COIN !!!", "error")
    }
  }

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <CRTOverlay />
      
      <AnimatePresence>
        {isAdminOpen && <AdminTerminal onClose={() => setIsAdminOpen(false)} onSave={(p) => {
          const updated = [p, ...posts];
          setPosts(updated);
          localStorage.setItem('pixel_posts', JSON.stringify(updated));
        }} />}
        {activePost && <PostViewer post={activePost} onClose={() => setActivePost(null)} />}
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
              {msg ? (
                <motion.p
                  key="msg"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  style={{ fontSize: '0.8rem', color: msg.type === 'error' ? '#ff0044' : 'var(--color-accent)' }}
                >
                  {msg.text}
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
              onClick={() => {
                setCoins(c => c + 1)
                if (coins === 2) triggerMsg("!!! ADMIN LINK ESTABLISHED !!!", "secret")
              }}
              style={{ padding: '1.5rem 3rem', fontSize: '1rem' }}
            >
              INSERT COIN {coins < 3 && <Lock size={16} style={{ marginLeft: '10px' }} />}
            </button>
          </motion.div>
        </header>

        <section style={{ marginTop: '4rem' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '2rem', borderBottom: '4px solid var(--color-primary)', display: 'inline-block' }}>
            Latest Transmission
          </h2>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} onRead={handleRead} />
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
