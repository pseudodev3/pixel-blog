// Pixel Blog Type Definitions

export interface Post {
  id: number
  title: string
  date: string
  category: string
  excerpt: string
  content: string
  icon?: React.ReactNode
}

export interface PixelBlogConfig {
  /** Container element or selector */
  container: HTMLElement | string
  
  /** Initial posts data (optional - will use default if not provided) */
  posts?: Post[]
  
  /** Admin password (default: '1337') */
  adminPassword?: string
  
  /** Custom CSS variables for theming */
  theme?: {
    colorBg?: string
    colorPrimary?: string
    colorSecondary?: string
    colorAccent?: string
    colorText?: string
  }
  
  /** Callback when a post is read */
  onPostRead?: (post: Post) => void
  
  /** Callback when a new post is created */
  onPostCreate?: (post: Post) => void
  
  /** Enable/disable admin panel */
  enableAdmin?: boolean
  
  /** Storage key prefix for localStorage */
  storageKey?: string
}

export interface PixelBlogInstance {
  /** Unmount the blog */
  destroy: () => void
  
  /** Add a new post programmatically */
  addPost: (post: Omit<Post, 'id' | 'date'>) => void
  
  /** Get all posts */
  getPosts: () => Post[]
  
  /** Clear all data */
  clearData: () => void
}
