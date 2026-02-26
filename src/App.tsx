import { motion, AnimatePresence } from 'framer-motion'
import { Terminal, Gamepad2, Cpu, Zap, Lock, Unlock, Plus, X, ArrowLeft, AlertTriangle } from 'lucide-react'
import { useState, useEffect } from 'react'
import treeBg from './assets/tree.webp'
import type { Post } from './types'

interface AppProps {
  /** Initial posts data */
  initialPosts?: Post[]
  /** Admin password */
  adminPassword?: string
  /** Storage key prefix */
  storageKey?: string
  /** Enable admin panel */
  enableAdmin?: boolean
  /** Callback when post is read */
  onPostRead?: (post: Post) => void
  /** Callback when post is created */
  onPostCreate?: (post: Post) => void
  /** Expose posts setter for external control */
  onPostsChange?: (posts: Post[]) => void
}

const DEFAULT_POSTS: Post[] = [
  {
    id: 1,
    title: "Level 1: The Pixel Revolution",
    date: "2026-02-26",
    category: "Graphics",
    excerpt: "Why low-res is high-fidelity for the soul. Exploring the aesthetic of limitations.",
    content: "In an age of 4K and photorealism, the pixel remains the fundamental unit of digital soul. By limiting our palette and resolution, we force the viewer's imagination to fill the gaps. This is the 'Uncanny Valley' in reverse—instead of being creeped out by almost-real faces, we are charmed by obviously-fake ones. Low-res isn't a limitation; it's a stylistic choice that prioritizes essence over detail.",
    icon: undefined
  },
  {
    id: 2,
    title: "Optimization as an Art Form",
    date: "2026-02-25",
    category: "Code",
    excerpt: "Squeezing every cycle out of the CPU. A deep dive into assembly-style thinking.",
    content: "The programmers of the 80s were wizards. They didn't have gigabytes of RAM; they had kilobytes. Every byte was a battle. Modern web development has grown bloated, but we can still apply those lessons. Lazy loading, tree shaking, and efficient state management are the modern versions of bank-switching and sprite multiplexing. Treat your user's CPU with respect.",
    icon: undefined
  },
  {
    id: 3,
    title: "The Ghost in the Machine",
    date: "2026-02-24",
    category: "AI",
    excerpt: "When the algorithm starts dreaming in 8-bit. The intersection of neural networks and retro aesthetics.",
    content: "Artificial Intelligence is often portrayed as a sleek, sterile future. But what if we gave it the constraints of the past? Generative art that follows the rules of the NES or C64 palette has a soul that pure high-def generation lacks. It's about the patterns, the dithering, and the happy accidents that occur when logic meets limitation. The ghost in the machine prefers scanlines.",
    icon: undefined
  }
]

const CRTOverlay = () => (
  <>
    <div className="crt-overlay" />
    <div className="crt-flicker" />
  </>
)

const Navbar = ({ onOpenAdmin, showAdmin }: { onOpenAdmin: () => void, showAdmin: boolean }) => (
  <nav className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2rem 1rem' }}>
    <motion.div 
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="neon-text-primary"
      style={{ fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer' }}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      PIXEL_LOG
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

const PostCard = ({ post, onRead, isUnlocked }: { post: Post, onRead: (post: Post) => void, isUnlocked: boolean }) => (
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
      {isUnlocked ? (
        <>READ MORE <Unlock size={12} style={{ color: 'var(--color-secondary)' }} /></>
      ) : (
        <>READ MORE <Terminal size={12} style={{ marginLeft: '8px' }} /></>
      )}
    </button>
  </motion.div>
)

const PostViewer = ({ post, onClose, isUnlocked, onUnlock }: { post: Post, onClose: () => void, isUnlocked: boolean, onUnlock: () => void }) => {
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

const AdminTerminal = ({ onClose, onSave, adminPassword }: { onClose: () => void, onSave: (post: Post) => void, adminPassword: string }) => {
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

export default function App({
  initialPosts,
  adminPassword = '1337',
  storageKey = 'pixel_blog',
  enableAdmin = true,
  onPostRead,
  onPostCreate,
  onPostsChange
}: AppProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [unlockedPosts, setUnlockedPosts] = useState<number[]>([])
  const [isAdminOpen, setIsAdminOpen] = useState(false)
  const [activePost, setActivePost] = useState<Post | null>(null)
  const [statusMsg, setStatusMsg] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load posts from localStorage or use initial/default
  useEffect(() => {
    const saved = localStorage.getItem(`${storageKey}_posts`)
    if (saved) {
      try {
        setPosts(JSON.parse(saved))
      } catch (e) {
        console.error('[PixelBlog] Failed to parse saved posts:', e)
        setPosts(initialPosts || DEFAULT_POSTS)
      }
    } else {
      setPosts(initialPosts || DEFAULT_POSTS)
    }

    const savedUnlocked = localStorage.getItem(`${storageKey}_unlocked`)
    if (savedUnlocked) {
      try {
        setUnlockedPosts(JSON.parse(savedUnlocked))
      } catch (e) {
        console.error('[PixelBlog] Failed to parse unlocked posts:', e)
      }
    }
    setIsLoaded(true)
  }, [initialPosts, storageKey])

  // Notify parent of posts changes
  useEffect(() => {
    if (isLoaded && onPostsChange) {
      onPostsChange(posts)
    }
  }, [posts, isLoaded, onPostsChange])

  const triggerStatus = (text: string) => {
    setStatusMsg(text)
    setTimeout(() => setStatusMsg(null), 3000)
  }

  const handleRead = (post: Post) => {
    setActivePost(post)
    if (onPostRead) onPostRead(post)
  }

  const handleUnlock = (postId: number) => {
    if (!unlockedPosts.includes(postId)) {
      const newUnlocked = [...unlockedPosts, postId]
      setUnlockedPosts(newUnlocked)
      localStorage.setItem(`${storageKey}_unlocked`, JSON.stringify(newUnlocked))
    }
  }

  const handleSavePost = (post: Post) => {
    const updated = [post, ...posts]
    setPosts(updated)
    localStorage.setItem(`${storageKey}_posts`, JSON.stringify(updated))
    if (onPostCreate) onPostCreate(post)
    triggerStatus("NEW_TRANSMISSION_UPLOADING...")
  }

  // Get icon component based on category
  const getPostIcon = (category: string) => {
    switch (category) {
      case 'Graphics': return <Cpu size={24} />
      case 'Code': return <Zap size={24} />
      case 'AI': return <Terminal size={24} />
      default: return undefined
    }
  }

  // Add icon to posts that need it
  const postsWithIcons = posts.map(post => ({
    ...post,
    icon: post.icon || getPostIcon(post.category)
  }))

  if (!isLoaded) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#000',
        color: '#ff00ff',
        fontFamily: 'Press Start 2P, monospace'
      }}>
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          LOADING...
        </motion.div>
      </div>
    )
  }

  return (
    <div className="pixel-blog-wrapper" style={{ 
      minHeight: '100vh', 
      position: 'relative',
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(${treeBg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      backgroundRepeat: 'no-repeat',
      backgroundColor: '#000'
    }}>
      <CRTOverlay />
      
      <AnimatePresence>
        {isAdminOpen && enableAdmin && (
          <AdminTerminal 
            onClose={() => setIsAdminOpen(false)} 
            onSave={handleSavePost}
            adminPassword={adminPassword}
          />
        )}
        {activePost && (
          <PostViewer 
            post={activePost} 
            onClose={() => setActivePost(null)} 
            isUnlocked={unlockedPosts.includes(activePost.id)}
            onUnlock={() => handleUnlock(activePost.id)}
          />
        )}
      </AnimatePresence>

      <Navbar onOpenAdmin={() => setIsAdminOpen(true)} showAdmin={enableAdmin} />

      <main className="container">
        <header style={{ textAlign: 'center', padding: '4rem 0' }}>
          <motion.h1 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="neon-text-primary"
            style={{ fontSize: '3rem', marginBottom: '1rem' }}
          >
            PIXEL_BLOG
          </motion.h1>
          
          <div style={{ height: '2rem', marginTop: '2rem' }}>
            <AnimatePresence>
              {statusMsg && (
                <motion.p
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  style={{ fontSize: '0.8rem', color: 'var(--color-accent)' }}
                >
                  {statusMsg}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </header>

        <section style={{ marginTop: '2rem' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '2rem', borderBottom: '4px solid var(--color-primary)', display: 'inline-block' }}>
            Latest Transmission
          </h2>
          {postsWithIcons.map((post) => (
            <PostCard 
              key={post.id} 
              post={post} 
              onRead={handleRead} 
              isUnlocked={unlockedPosts.includes(post.id)} 
            />
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
