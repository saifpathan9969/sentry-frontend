# Sentry - Deployment Guide

## Frontend Deployment (Vercel/Netlify)

### Option 1: Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   cd frontend
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/sentry-frontend.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Configure:
     - Framework Preset: Vite
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - Add Environment Variable:
     - `VITE_API_BASE_URL` = Your backend URL (e.g., `https://your-backend.onrender.com/api/v1`)
   - Click "Deploy"

### Option 2: Netlify

1. **Push to GitHub** (same as above)

2. **Deploy to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" > "Import an existing project"
   - Connect to GitHub and select your repository
   - Configure:
     - Build Command: `npm run build`
     - Publish Directory: `dist`
   - Add Environment Variable:
     - `VITE_API_BASE_URL` = Your backend URL
   - Click "Deploy site"

3. **Add Redirects for SPA**
   Create `frontend/public/_redirects`:
   ```
   /*    /index.html   200
   ```

## Backend Deployment (Render/Railway)

### Option 1: Render (Free Tier Available)

1. **Push backend to GitHub**
   ```bash
   cd backend
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/sentry-backend.git
   git push -u origin main
   ```

2. **Deploy to Render**
   - Go to [render.com](https://render.com)
   - Click "New" > "Web Service"
   - Connect your GitHub repository
   - Configure:
     - Name: `sentry-backend`
     - Runtime: Python 3
     - Build Command: `pip install -r requirements.txt`
     - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - Add Environment Variables:
     - `DATABASE_URL` = Your Neon PostgreSQL URL
     - `SECRET_KEY` = A secure random string
     - `CORS_ORIGINS` = Your frontend URL (e.g., `https://sentry.vercel.app`)
   - Click "Create Web Service"

### Option 2: Railway

1. **Deploy to Railway**
   - Go to [railway.app](https://railway.app)
   - Click "New Project" > "Deploy from GitHub repo"
   - Select your backend repository
   - Add Environment Variables (same as Render)
   - Railway will auto-detect Python and deploy

## Environment Variables

### Frontend (.env.production)
```
VITE_API_BASE_URL=https://your-backend-url.com/api/v1
```

### Backend
```
DATABASE_URL=postgresql://user:pass@host/db
SECRET_KEY=your-super-secret-key-here
CORS_ORIGINS=https://your-frontend-url.vercel.app
```

## Post-Deployment Checklist

1. ✅ Update frontend `VITE_API_BASE_URL` with actual backend URL
2. ✅ Update backend `CORS_ORIGINS` with actual frontend URL
3. ✅ Test login/register functionality
4. ✅ Test scan creation
5. ✅ Verify database connection

## Custom Domain (Optional)

### Vercel
1. Go to Project Settings > Domains
2. Add your custom domain
3. Update DNS records as instructed

### Netlify
1. Go to Site Settings > Domain Management
2. Add custom domain
3. Update DNS records as instructed

## Troubleshooting

### CORS Errors
- Ensure `CORS_ORIGINS` in backend includes your frontend URL
- Include both `http://` and `https://` versions if needed

### API Connection Failed
- Check `VITE_API_BASE_URL` is correct
- Ensure backend is running and accessible
- Check browser console for specific errors

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Ensure database allows connections from your hosting provider's IP
