import { motion, AnimatePresence } from 'framer-motion'
import { Terminal, Cpu, Zap, AlertTriangle, Gamepad2 } from 'lucide-react'
import { useState, useEffect, useMemo, useCallback } from 'react'
import treeBg from './assets/tree.webp'
import type { Post, PixelBlogConfig } from './types'
import { audio } from './utils/audio'

// Components
import { CRTOverlay } from './components/CRTOverlay'
import { Navbar } from './components/Navbar'
import { PostCard } from './components/PostCard'
import { PostViewer } from './components/PostViewer'
import { AdminTerminal } from './components/AdminTerminal'

interface AppProps {
  /** Initial posts data */
  initialPosts?: Post[]
  /** Admin password */
  adminPassword?: string
  /** Storage key prefix */
  storageKey?: string
  /** Enable admin panel */
  enableAdmin?: boolean
  /** Enable sound effects */
  enableAudio?: boolean
  /** Custom theme colors */
  theme?: PixelBlogConfig['theme']
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
    icon: 'cpu'
  },
  {
    id: 2,
    title: "Optimization as an Art Form",
    date: "2026-02-25",
    category: "Code",
    excerpt: "Squeezing every cycle out of the CPU. A deep dive into assembly-style thinking.",
    content: "The programmers of the 80s were wizards. They didn't have gigabytes of RAM; they had kilobytes. Every byte was a battle. Modern web development has grown bloated, but we can still apply those lessons. Lazy loading, tree shaking, and efficient state management are the modern versions of bank-switching and sprite multiplexing. Treat your user's CPU with respect.",
    icon: 'zap'
  },
  {
    id: 3,
    title: "The Ghost in the Machine",
    date: "2026-02-24",
    category: "AI",
    excerpt: "When the algorithm starts dreaming in 8-bit. The intersection of neural networks and retro aesthetics.",
    content: "Artificial Intelligence is often portrayed as a sleek, sterile future. But what if we gave it the constraints of the past? Generative art that follows the rules of the NES or C64 palette has a soul that pure high-def generation lacks. It's about the patterns, the dithering, and the happy accidents that occur when logic meets limitation. The ghost in the machine prefers scanlines.",
    icon: 'terminal'
  }
]

export default function App({
  initialPosts,
  adminPassword = '1337',
  storageKey = 'pixel_blog',
  enableAdmin = true,
  enableAudio = true,
  theme,
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
  
  // Discovery States
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [isAudioEnabled, setIsAudioEnabled] = useState(enableAudio)

  // Sync audio state with utility
  useEffect(() => {
    audio.setEnabled(isAudioEnabled)
  }, [isAudioEnabled])

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

  // Listen for programmatic post additions
  useEffect(() => {
    const handleAddPost = (e: any) => {
      if (e.detail) {
        const newPost: Post = {
          ...e.detail,
          id: Date.now(),
          date: new Date().toISOString().split('T')[0]
        }
        handleSavePost(newPost)
      }
    }
    
    window.addEventListener('pixelblog:addPost', handleAddPost)
    return () => window.removeEventListener('pixelblog:addPost', handleAddPost)
  }, [posts])

  // Notify parent of posts changes
  useEffect(() => {
    if (isLoaded && onPostsChange) {
      onPostsChange(posts)
    }
  }, [posts, isLoaded, onPostsChange])

  const triggerStatus = useCallback((text: string, type: 'success' | 'error' | 'info' = 'info') => {
    setStatusMsg(text)
    if (type === 'success') audio.playSuccess()
    if (type === 'error') audio.playError()
    setTimeout(() => setStatusMsg(null), 3000)
  }, [])

  const handleRead = (post: Post) => {
    audio.playClick()
    setActivePost(post)
    if (onPostRead) onPostRead(post)
  }

  const handleUnlock = (postId: number) => {
    if (!unlockedPosts.includes(postId)) {
      const newUnlocked = [...unlockedPosts, postId]
      setUnlockedPosts(newUnlocked)
      localStorage.setItem(`${storageKey}_unlocked`, JSON.stringify(newUnlocked))
      audio.playDecrypt()
    }
  }

  const handleSavePost = (post: Post) => {
    setPosts(current => {
      const existingIndex = current.findIndex(p => p.id === post.id)
      let updated: Post[]
      if (existingIndex > -1) {
        updated = [...current]
        updated[existingIndex] = post
      } else {
        updated = [post, ...current]
      }
      localStorage.setItem(`${storageKey}_posts`, JSON.stringify(updated))
      return updated
    })
    if (onPostCreate) onPostCreate(post)
    triggerStatus(post.id ? "TRANSMISSION_UPDATED..." : "NEW_TRANSMISSION_UPLOADING...", 'success')
  }

  const handleDeletePost = (postId: number) => {
    setPosts(current => {
      const updated = current.filter(p => p.id !== postId)
      localStorage.setItem(`${storageKey}_posts`, JSON.stringify(updated))
      return updated
    })
    triggerStatus("TRANSMISSION_DELETED", 'error')
  }

  const handleImportPosts = (newPosts: Post[]) => {
    setPosts(newPosts)
    localStorage.setItem(`${storageKey}_posts`, JSON.stringify(newPosts))
    triggerStatus("DATABASE_RESTORED_SUCCESSFULLY", 'success')
  }

  // Apply theme variables
  const wrapperStyle = useMemo(() => {
    const style: React.CSSProperties = {
      minHeight: '100vh', 
      position: 'relative',
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url(${treeBg})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      backgroundRepeat: 'no-repeat',
      backgroundColor: '#000'
    }

    if (theme) {
      if (theme.colorBg) (style as any)['--color-bg'] = theme.colorBg
      if (theme.colorPrimary) (style as any)['--color-primary'] = theme.colorPrimary
      if (theme.colorSecondary) (style as any)['--color-secondary'] = theme.colorSecondary
      if (theme.colorAccent) (style as any)['--color-accent'] = theme.colorAccent
      if (theme.colorText) (style as any)['--color-text'] = theme.colorText
    }

    return style
  }, [theme])

  // Get unique categories for filtering
  const categories = useMemo(() => {
    const cats = new Set(posts.map(p => p.category))
    return Array.from(cats).sort()
  }, [posts])

  // Filter and Search logic
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           post.content.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = !activeCategory || post.category === activeCategory
      return matchesSearch && matchesCategory
    })
  }, [posts, searchQuery, activeCategory])

  // Get icon component based on name
  const getPostIcon = (iconName?: string, category?: string) => {
    const name = iconName || (category === 'Graphics' ? 'cpu' : category === 'Code' ? 'zap' : 'terminal')
    switch (name) {
      case 'cpu': return <Cpu size={24} />
      case 'zap': return <Zap size={24} />
      case 'terminal': return <Terminal size={24} />
      case 'gamepad': return <Gamepad2 size={24} />
      default: return <Terminal size={24} />
    }
  }

  // Add icon to posts
  const postsWithIcons = useMemo(() => filteredPosts.map(post => ({
    ...post,
    renderedIcon: getPostIcon(post.icon, post.category)
  })), [filteredPosts])

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
    <div className="pixel-blog-wrapper" style={wrapperStyle}>
      <CRTOverlay />
      
      <AnimatePresence>
        {isAdminOpen && enableAdmin && (
          <AdminTerminal 
            posts={posts}
            onClose={() => setIsAdminOpen(false)} 
            onSave={handleSavePost}
            onDelete={handleDeletePost}
            onImport={handleImportPosts}
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

      <Navbar 
        onOpenAdmin={() => { audio.playClick(); setIsAdminOpen(true); }} 
        showAdmin={enableAdmin}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        categories={categories}
        isAudioEnabled={isAudioEnabled}
        setIsAudioEnabled={setIsAudioEnabled}
      />

      <main className="container">
        <div style={{ height: '2rem', display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <AnimatePresence>
            {statusMsg && (
              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -10, opacity: 0 }}
                style={{ fontSize: '0.7rem', color: 'var(--color-accent)', letterSpacing: '4px' }}
              >
                {statusMsg}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <section style={{ marginTop: '1rem' }}>
          <div className="pixel-border" style={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            alignItems: 'center', 
            marginBottom: '4rem', 
            padding: '1rem 1.5rem',
            background: 'rgba(255,255,255,0.02)',
            borderColor: '#222',
            fontSize: '0.6rem',
            letterSpacing: '2px',
            color: '#666'
          }}>
            <span style={{ color: 'var(--color-secondary)' }}>TOTAL_OBJECTS: {filteredPosts.length}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>

            {postsWithIcons.map((post) => (
              <PostCard 
                key={post.id} 
                post={post} 
                onRead={handleRead} 
                isUnlocked={unlockedPosts.includes(post.id)} 
              />
            ))}
          </div>
          
          {filteredPosts.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem', opacity: 0.5 }}>
              <p style={{ fontSize: '0.8rem' }}>NO_TRANSMISSIONS_FOUND</p>
            </div>
          )}
        </section>
      </main>

      <footer className="container" style={{ textAlign: 'center', padding: '4rem 0', fontSize: '0.6rem', color: '#666' }}>
        <p>© 2026 PIXEL BLOG ENGINE. ALL RIGHTS RESERVED.</p>
        <p style={{ marginTop: '1rem' }}>MADE WITH 8-BIT PASSION</p>
      </footer>
    </div>
  )
}
