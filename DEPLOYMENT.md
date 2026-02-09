# Deployment Guide

## Deploy to Vercel

### Prerequisites
- Vercel account (sign up at https://vercel.com)
- Git repository pushed to GitHub/GitLab/Bitbucket

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. Go to https://vercel.com/new
2. Import your Git repository
3. Vercel will auto-detect Vite configuration
4. Click "Deploy"
5. Your app will be live at: `https://your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy to production:
   ```bash
   vercel --prod
   ```

4. Follow the prompts:
   - Set up and deploy: Y
   - Which scope: Select your account
   - Link to existing project: N (first time)
   - Project name: kpi-tracker (or your choice)
   - Directory: ./ (current directory)
   - Override settings: N

### Build Configuration

The project is pre-configured with `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This ensures:
- Proper SPA routing (all routes redirect to index.html)
- Vite build process is used
- Output directory is correctly set to `dist`

### Environment Variables

No environment variables are required. All data is stored in browser localStorage.

### PWA Installation

After deployment, users can install the app:

**iOS Safari:**
1. Open the app in Safari
2. Tap the Share button
3. Tap "Add to Home Screen"
4. Tap "Add"

**Android Chrome:**
1. Open the app in Chrome
2. Tap the menu (⋮)
3. Tap "Add to Home screen"
4. Tap "Add"

**Desktop (Chrome/Edge):**
1. Open the app
2. Click the install icon (⊕) in the address bar
3. Click "Install"

### Post-Deployment Checklist

- [ ] Test all routes (/, /daily-log, /weekly-review, /monthly-guide)
- [ ] Test on mobile device
- [ ] Verify PWA installation works
- [ ] Test offline functionality
- [ ] Verify localStorage persistence
- [ ] Check responsive design on different screen sizes

### Troubleshooting

**Issue: Routes return 404**
- Ensure `vercel.json` has the rewrites configuration
- Redeploy after adding the configuration

**Issue: Icons not showing**
- Check that `public/` directory has icon files
- Verify manifest.webmanifest is generated in build

**Issue: PWA not installable**
- Must be served over HTTPS (Vercel provides this automatically)
- Check manifest.webmanifest is accessible
- Verify service worker is registered

### Custom Domain

To use a custom domain:

1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records as instructed
4. Wait for DNS propagation (5-30 minutes)

### Performance Tips

- Vercel Edge Network provides global CDN
- Service worker caches assets for offline use
- Lazy loading can be added for code splitting
- Consider adding analytics (Vercel Analytics)

### Support

For issues with deployment:
- Vercel Support: https://vercel.com/support
- Project Issues: https://github.com/Boatshipxxx/kpi-tracker/issues
