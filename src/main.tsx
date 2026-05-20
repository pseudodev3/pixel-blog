import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { ErrorBoundary } from './ErrorBoundary'
import type { PixelBlogConfig, PixelBlogInstance, Post } from './types'

// Import CSS as string for Shadow DOM injection
import cssContent from './index.css?inline'

// Add Google Font link
const FONT_URL = 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap'

/**
 * Mount Pixel Blog into a container with Shadow DOM for style isolation
 */
function mountWithShadowDOM(
  container: HTMLElement,
  props: Omit<PixelBlogConfig, 'container'>
): PixelBlogInstance {
  // Create shadow root
  const shadowRoot = container.attachShadow({ mode: 'open' })
  
  // Create container for React
  const reactRoot = document.createElement('div')
  reactRoot.id = 'pixel-blog-root'
  reactRoot.style.width = '100%'
  reactRoot.style.minHeight = '100%'
  
  // Inject font link
  const fontLink = document.createElement('link')
  fontLink.rel = 'stylesheet'
  fontLink.href = FONT_URL
  shadowRoot.appendChild(fontLink)
  
  // Inject styles
  const styleEl = document.createElement('style')
  styleEl.textContent = cssContent
  shadowRoot.appendChild(styleEl)
  
  // Add reset styles
  const resetStyle = document.createElement('style')
  resetStyle.textContent = `
    :host { display: block; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    #pixel-blog-root { width: 100%; min-height: 100vh; }
  `
  shadowRoot.appendChild(resetStyle)
  
  shadowRoot.appendChild(reactRoot)
  
  // Mount React
  const root = ReactDOM.createRoot(reactRoot)
  
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App 
          initialPosts={props.posts}
          adminPassword={props.adminPassword}
          storageKey={props.storageKey}
          enableAdmin={props.enableAdmin !== false}
          enableAudio={props.enableAudio !== false}
          theme={props.theme}
          onPostRead={props.onPostRead}
          onPostCreate={props.onPostCreate}
        />
      </ErrorBoundary>
    </React.StrictMode>
  )
  
  return {
    destroy: () => {
      root.unmount()
      if (container.shadowRoot) {
        container.shadowRoot.innerHTML = ''
      }
    },
    addPost: (post) => {
      const event = new CustomEvent('pixelblog:addPost', { detail: post })
      window.dispatchEvent(event)
    },
    getPosts: () => {
      const key = props.storageKey || 'pixel_blog'
      const saved = localStorage.getItem(`${key}_posts`)
      return saved ? JSON.parse(saved) : props.posts || []
    },
    clearData: () => {
      const key = props.storageKey || 'pixel_blog'
      localStorage.removeItem(`${key}_posts`)
      localStorage.removeItem(`${key}_unlocked`)
    },
    setAudioEnabled: (enabled: boolean) => {
      const event = new CustomEvent('pixelblog:setAudio', { detail: { enabled } })
      window.dispatchEvent(event)
    }
  }
}

/**
 * Mount Pixel Blog without Shadow DOM (legacy mode)
 */
function mountWithoutShadowDOM(
  container: HTMLElement,
  props: Omit<PixelBlogConfig, 'container'>
): PixelBlogInstance {
  if (!document.querySelector('link[href*="Press+Start+2P"]')) {
    const fontLink = document.createElement('link')
    fontLink.rel = 'stylesheet'
    fontLink.href = FONT_URL
    document.head.appendChild(fontLink)
  }
  
  const root = ReactDOM.createRoot(container)
  
  root.render(
    <React.StrictMode>
      <ErrorBoundary>
        <App 
          initialPosts={props.posts}
          adminPassword={props.adminPassword}
          storageKey={props.storageKey}
          enableAdmin={props.enableAdmin !== false}
          enableAudio={props.enableAudio !== false}
          theme={props.theme}
          onPostRead={props.onPostRead}
          onPostCreate={props.onPostCreate}
        />
      </ErrorBoundary>
    </React.StrictMode>
  )
  
  return {
    destroy: () => root.unmount(),
    addPost: (post) => {
      const event = new CustomEvent('pixelblog:addPost', { detail: post })
      window.dispatchEvent(event)
    },
    getPosts: () => {
      const key = props.storageKey || 'pixel_blog'
      const saved = localStorage.getItem(`${key}_posts`)
      return saved ? JSON.parse(saved) : props.posts || []
    },
    clearData: () => {
      const key = props.storageKey || 'pixel_blog'
      localStorage.removeItem(`${key}_posts`)
      localStorage.removeItem(`${key}_unlocked`)
    },
    setAudioEnabled: (enabled: boolean) => {
      const event = new CustomEvent('pixelblog:setAudio', { detail: { enabled } })
      window.dispatchEvent(event)
    }
  }
}

/**
 * Main mount function
 */
export function mountPixelBlog(config: PixelBlogConfig): PixelBlogInstance {
  const { container, ...props } = config
  const containerEl = typeof container === 'string' ? document.querySelector(container) : container
  if (!containerEl) throw new Error(`[PixelBlog] Container not found: ${container}`)
  const useShadowDOM = 'attachShadow' in Element.prototype
  if (useShadowDOM) return mountWithShadowDOM(containerEl as HTMLElement, props)
  return mountWithoutShadowDOM(containerEl as HTMLElement, props)
}

if (typeof window !== 'undefined') {
  ;(window as any).PixelBlog = { mount: mountPixelBlog }
  const autoContainer = document.getElementById('root')
  if (autoContainer && !autoContainer.shadowRoot) {
    mountPixelBlog({ container: autoContainer, enableAdmin: true })
  }
}

export type { PixelBlogConfig, PixelBlogInstance, Post }
export { ErrorBoundary }
export default mountPixelBlog
