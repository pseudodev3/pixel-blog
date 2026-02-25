import { motion } from 'framer-motion'
import { Terminal, Gamepad2, Cpu, Zap } from 'lucide-react'
import { useState, useEffect } from 'react'

const posts = [
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
  },
  {
    id: 3,
    title: "Insert Coin to Continue",
    date: "2026-02-24",
    category: "Design",
    excerpt: "The psychology of arcade mechanics in modern UX design.",
    icon: <Gamepad2 size={24} />
  }
]

const CRTOverlay = () => (
  <>
    <div className="crt-overlay" />
    <div className="crt-flicker" />
  </>
)

const Navbar = () => (
  <nav className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '2rem 1rem' }}>
    <motion.div 
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="neon-text-primary"
      style={{ fontSize: '1.2rem', fontWeight: 'bold' }}
    >
      PIXEL_LOG
    </motion.div>
    <div style={{ display: 'flex', gap: '1.5rem' }}>
      {['Posts', 'About', 'Contact'].map((item, i) => (
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
    </div>
  </nav>
)

const PostCard = ({ post, index }: { post: typeof posts[0], index: number }) => (
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

export default function App() {
  const [coins, setCoins] = useState(0)

  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <CRTOverlay />
      
      <Navbar />

      <main className="container">
        <header style={{ textAlign: 'center', padding: '4rem 0' }}>
          <motion.h1 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{ fontSize: '2.5rem', marginBottom: '1rem' }}
            className="neon-text-primary"
          >
            PIXEL BLOG
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{ fontSize: '0.8rem', color: 'var(--color-secondary)' }}
          >
            HIGH SCORE: {coins * 1000} | CREDITS: {coins}
          </motion.p>
          
          <motion.div 
            style={{ marginTop: '2rem' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <button 
              className="pixel-button" 
              onClick={() => setCoins(c => c + 1)}
              style={{ padding: '1.5rem 3rem', fontSize: '1rem' }}
            >
              INSERT COIN
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
