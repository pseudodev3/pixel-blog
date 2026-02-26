# Deployment Guide for Personal Server

## Method 1: Static File Hosting (Simplest)

### 1. Build the Plugin

```bash
npm install
npm run build
```

This creates:
- `dist/pixel-blog.standalone.js` - Self-contained version
- `dist/pixel-blog.umd.js` - For sites with React
- `dist/pixel-blog.es.js` - ES module version

### 2. Upload to Your Server

```bash
# Using SCP
scp -r dist/ user@yourserver.com:/var/www/html/pixel-blog/

# Or using rsync
rsync -avz dist/ user@yourserver.com:/var/www/html/pixel-blog/

# Or using FTP - upload dist/ contents to /pixel-blog/ directory
```

### 3. Embed in Your Website

Add to your HTML:

```html
<div id="pixel-blog"></div>
<script src="/pixel-blog/pixel-blog.standalone.js"></script>
<script>
  PixelBlog.mount({
    container: '#pixel-blog',
    adminPassword: 'your-secure-password',
    storageKey: 'my_site_blog'
  });
</script>
```

## Method 2: NPM Package (If you use a bundler)

### 1. Build and Package

```bash
npm run build
npm pack
```

This creates `pixel-blog-0.2.0.tgz`

### 2. Install on Your Server

```bash
cd /var/www/your-site
npm install /path/to/pixel-blog-0.2.0.tgz
```

### 3. Import in Your Code

```javascript
import { mountPixelBlog } from 'pixel-blog';

mountPixelBlog({
  container: document.getElementById('blog'),
  posts: [...]
});
```

## Method 3: CDN-style with Cloud Storage

Upload `pixel-blog.standalone.js` to:
- AWS S3 + CloudFront
- Cloudflare R2
- GitHub Releases
- Any static file CDN

Then reference:

```html
<script src="https://cdn.yoursite.com/pixel-blog.standalone.js"></script>
```

## Server Configuration

### Nginx

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    
    location /blog {
        alias /var/www/html/pixel-blog/dist;
        expires 1M;
        add_header Cache-Control "public, immutable";
    }
    
    # CORS headers if needed
    location /blog/*.js {
        add_header Access-Control-Allow-Origin *;
    }
}
```

### Apache

```apache
<Directory "/var/www/html/pixel-blog">
    Header set Cache-Control "public, max-age=2592000"
</Directory>

<FilesMatch "\.(js)$">
    Header set Access-Control-Allow-Origin "*"
</FilesMatch>
```

## Security Checklist

- [ ] Change default admin password
- [ ] Disable admin panel in production (`enableAdmin: false`)
- [ ] Use HTTPS (required for Shadow DOM in some cases)
- [ ] Set proper CORS headers
- [ ] Add CSP headers if needed

## Troubleshooting

| Issue | Solution |
|-------|----------|
| 404 on JS file | Check path matches server config |
| Styles not loading | Ensure Shadow DOM is supported (modern browsers) |
| Font not loading | Check CORS on font CDN |
| localStorage errors | Use same origin, check HTTPS |
