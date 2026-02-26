# Pixel Blog Integration Guide

## Overview

Pixel Blog can be embedded in any website as a plugin. It uses **Shadow DOM** for complete style isolation, meaning it won't conflict with your site's CSS.

## Build Output Files

After running `npm run build`, you'll get:

| File | Description | Use When |
|------|-------------|----------|
| `dist/pixel-blog.standalone.js` | Bundled with React (~180KB) | Site doesn't use React |
| `dist/pixel-blog.umd.js` | Requires external React (~50KB) | Site already uses React |
| `dist/pixel-blog.es.js` | ES module version | Using ES modules/bundlers |

## Quick Start

### 1. Upload Files to Your Server

```bash
# Build the plugin
npm run build

# Upload to your server
scp dist/pixel-blog.standalone.js user@yourserver.com:/var/www/html/blog/
```

### 2. Embed in Your HTML

```html
<!DOCTYPE html>
<html>
<head>
  <title>My Website</title>
</head>
<body>
  <!-- Your website content -->
  <h1>Welcome to My Site</h1>
  
  <!-- Pixel Blog Container -->
  <div id="pixel-blog" style="min-height: 600px;"></div>
  
  <!-- Load Pixel Blog -->
  <script src="/blog/pixel-blog.standalone.js"></script>
  <script>
    PixelBlog.mount({
      container: '#pixel-blog'
    });
  </script>
</body>
</html>
```

## Configuration Options

```javascript
PixelBlog.mount({
  // Required
  container: '#pixel-blog',        // CSS selector or HTMLElement
  
  // Optional - Data
  posts: [...],                    // Initial posts array
  
  // Optional - Security
  adminPassword: 'your-password',  // Default: '1337'
  enableAdmin: true,               // Show/hide add post button
  storageKey: 'my_blog',           // localStorage prefix
  
  // Optional - Callbacks
  onPostRead: (post) => {},        // Called when post is opened
  onPostCreate: (post) => {}       // Called when new post is added
});
```

## Post Data Structure

```typescript
{
  id: number,           // Auto-generated
  title: string,        // Post title
  date: string,         // YYYY-MM-DD
  category: string,     // Category label
  excerpt: string,      // Short preview (max ~100 chars)
  content: string       // Full post content
}
```

## API Methods

```javascript
const blog = PixelBlog.mount({ container: '#pixel-blog' });

// Get all posts
const posts = blog.getPosts();

// Add post programmatically
blog.addPost({
  title: 'New Post',
  content: 'Post content here...',
  excerpt: 'Short preview...',
  category: 'Tech'
});

// Clear all data
blog.clearData();

// Destroy/unmount
blog.destroy();
```

## Styling Integration

The blog is rendered in a **Shadow DOM**, so:

- ✅ Your site's CSS won't affect the blog
- ✅ Blog CSS won't leak to your site
- ✅ Blog styles are completely encapsulated

To customize the blog appearance, modify `src/index.css` and rebuild.

## Security Considerations

⚠️ **Important**: The admin password is visible in the JavaScript bundle. For production use:

1. **Option A**: Set `enableAdmin: false` and manage posts via:
   - Your own backend API
   - Manual JSON file updates
   
2. **Option B**: Implement server-side authentication before allowing post creation

3. **Option C**: Use the plugin as a **read-only** display

```javascript
// Read-only mode (no admin panel)
PixelBlog.mount({
  container: '#pixel-blog',
  enableAdmin: false,
  posts: [/* your posts from server */]
});
```

## Server-Side Integration Example (Node.js/Express)

```javascript
const express = require('express');
const fs = require('fs');
const app = express();

// Serve static files
app.use('/blog', express.static('dist'));

// API endpoint to get posts
app.get('/api/posts', (req, res) => {
  const posts = JSON.parse(fs.readFileSync('./posts.json'));
  res.json(posts);
});

// Your main page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head><title>My Site</title></head>
    <body>
      <div id="blog"></div>
      <script src="/blog/pixel-blog.standalone.js"></script>
      <script>
        fetch('/api/posts')
          .then(r => r.json())
          .then(posts => {
            PixelBlog.mount({
              container: '#blog',
              posts: posts,
              enableAdmin: false  // Server-managed
            });
          });
      </script>
    </body>
    </html>
  `);
});

app.listen(3000);
```

## Deployment Checklist

- [ ] Build the project: `npm run build`
- [ ] Upload `dist/` folder to your server
- [ ] Update HTML to reference the correct path
- [ ] Test in different browsers
- [ ] Verify admin password is changed (if using admin)
- [ ] Consider disabling admin for production
- [ ] Set up HTTPS (required for Shadow DOM in some browsers)

## Troubleshooting

### Blog not showing
- Check browser console for errors
- Verify the script path is correct
- Ensure container element exists before calling `mount()`

### Styles look wrong
- Shadow DOM provides isolation - check browser DevTools
- Ensure font is loading (check Network tab)

### Admin panel not working
- Default password is `1337` (change it!)
- Check `enableAdmin: true` is set
