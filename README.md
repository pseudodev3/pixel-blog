# PIXEL BLOG 🕹️

A high-performance, embeddable pixel-art blog plugin with complete style isolation via Shadow DOM.

## ✨ Features

- **Shadow DOM Isolation** - Won't conflict with your site's CSS
- **CRT Scanline Effect** - Authentic retro monitor feel
- **Gamified UX** - "Decrypt" animation, unlock system
- **Admin Panel** - Add posts via UI (password protected)
- **Local Storage** - Persists posts and read state
- **TypeScript** - Fully typed
- **Lightweight** - ~50KB with external React, ~180KB standalone

## 🚀 Quick Start

### 1. Build

```bash
npm install
npm run build
```

### 2. Upload to Your Server

```bash
scp -r dist/ user@server:/var/www/html/pixel-blog/
```

### 3. Embed

```html
<div id="pixel-blog"></div>
<script src="/pixel-blog/pixel-blog.standalone.js"></script>
<script>
  PixelBlog.mount({
    container: '#pixel-blog',
    adminPassword: 'your-secret-password'
  });
</script>
```

## 📁 Project Structure

```
pixel-blog/
├── src/
│   ├── App.tsx           # Main blog component
│   ├── main.tsx          # Plugin entry point with Shadow DOM
│   ├── types.ts          # TypeScript definitions
│   ├── ErrorBoundary.tsx # Error handling
│   ├── index.css         # Scoped styles
│   └── assets/           # Images
├── dist/                 # Build output
├── example-embed.html    # Integration example
├── INTEGRATION.md        # Full integration guide
└── DEPLOY.md             # Deployment instructions
```

## 🎨 Configuration

```javascript
PixelBlog.mount({
  container: '#pixel-blog',        // Required: CSS selector or element
  posts: [...],                    // Optional: Initial posts
  adminPassword: '1337',           // Optional: Admin password
  storageKey: 'pixel_blog',        // Optional: localStorage prefix
  enableAdmin: true,               // Optional: Show add button
  onPostRead: (post) => {},        // Optional: Read callback
  onPostCreate: (post) => {}       // Optional: Create callback
});
```

## 🔒 Security Notes

- **Default password**: `1337` (change it!)
- **Production**: Set `enableAdmin: false` and manage posts server-side
- **Data storage**: Uses browser localStorage (per-domain)

## 📚 Documentation

- **[INTEGRATION.md](INTEGRATION.md)** - Full integration guide
- **[DEPLOY.md](DEPLOY.md)** - Server deployment instructions
- **[example-embed.html](example-embed.html)** - Working example

## 🛠️ Development

```bash
npm run dev          # Start dev server
npm run build        # Build all versions
npm run build:lib    # Build library only
npm run preview      # Preview build
```

## 📦 Build Outputs

| File | Size | Use Case |
|------|------|----------|
| `pixel-blog.standalone.js` | ~180KB | Sites without React |
| `pixel-blog.umd.js` | ~50KB | Sites with React |
| `pixel-blog.es.js` | ~50KB | ES module bundlers |

## 🔧 Tech Stack

- React 18 + TypeScript
- Vite (build tool)
- Framer Motion (animations)
- Lucide React (icons)
- Shadow DOM (style isolation)

## 📝 License

MIT
