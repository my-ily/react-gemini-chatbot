# Deployment Guide

This guide explains how to deploy the chatbot application to production.

## Overview

The application consists of two separate parts:
1. **Backend** (Node.js/Express) - Handles API requests to Google Gemini
2. **Frontend** (React) - User interface

These need to be deployed separately.

---

## Option 1: Deploy to Separate Platforms (Recommended)

### Backend Deployment (Railway / Render / Heroku)

#### Using Railway (Recommended - Free tier available)

1. Go to [railway.app](https://railway.app) and sign up
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Railway will auto-detect Node.js
5. Add environment variables:
   - `GOOGLE_API_KEY` = your Google API key
   - `PORT` = (optional, Railway sets this automatically)
6. Deploy!

**Backend URL will be:** `https://your-app-name.railway.app`

#### Using Render

1. Go to [render.com](https://render.com) and sign up
2. Click "New" → "Web Service"
3. Connect your GitHub repo
4. Settings:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
5. Add environment variables:
   - `GOOGLE_API_KEY` = your Google API key
6. Deploy!

**Backend URL will be:** `https://your-app-name.onrender.com`

---

### Frontend Deployment (Vercel / Netlify)

#### Using Vercel (Recommended - Free tier)

1. Go to [vercel.com](https://vercel.com) and sign up
2. Click "Add New Project" → Import your GitHub repo
3. Settings:
   - **Root Directory:** `frontend`
   - **Framework Preset:** Create React App
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
4. Add environment variable:
   - `REACT_APP_API_URL` = your backend URL (e.g., `https://your-app-name.railway.app`)
5. Deploy!

**Frontend URL will be:** `https://your-app-name.vercel.app`

#### Using Netlify

1. Go to [netlify.com](https://netlify.com) and sign up
2. Click "Add new site" → "Import an existing project"
3. Connect GitHub repo
4. Settings:
   - **Base directory:** `frontend`
   - **Build command:** `npm run build`
   - **Publish directory:** `frontend/build`
5. Add environment variable:
   - `REACT_APP_API_URL` = your backend URL
6. Deploy!

**Frontend URL will be:** `https://your-app-name.netlify.app`

---

## Option 2: Deploy Both on Same Platform

### Using Render (Full Stack)

1. Deploy Backend as Web Service (see above)
2. Deploy Frontend as Static Site:
   - **Root Directory:** `frontend`
   - **Build Command:** `npm install && npm run build`
   - **Publish Directory:** `build`
   - Add `REACT_APP_API_URL` environment variable

---

## Important Notes

### CORS Configuration

The backend already has CORS enabled, so it should work with any frontend URL.

### Environment Variables

**Backend needs:**
- `GOOGLE_API_KEY` - Your Google Gemini API key
- `PORT` - (Optional, defaults to 5009)

**Frontend needs:**
- `REACT_APP_API_URL` - Your backend URL (without trailing slash)
  - Example: `https://your-backend.railway.app`
  - NOT: `https://your-backend.railway.app/`

### Testing After Deployment

1. Test backend: Visit `https://your-backend-url.com/` - should show "Server is running ✅"
2. Test frontend: Visit `https://your-frontend-url.com` - should load the chat interface
3. Send a message - it should connect to the backend

---

## Troubleshooting

### Frontend can't connect to backend
- Check `REACT_APP_API_URL` is set correctly
- Make sure backend URL doesn't have trailing slash
- Check backend CORS settings
- Verify backend is running and accessible

### Backend errors
- Check `GOOGLE_API_KEY` is set correctly
- Verify API key has proper permissions
- Check backend logs for detailed errors

### Build errors
- Make sure all dependencies are in `package.json`
- Check Node.js version compatibility
- Review build logs for specific errors

---

## Quick Deploy Checklist

- [ ] Backend deployed and accessible
- [ ] `GOOGLE_API_KEY` set in backend environment
- [ ] Frontend deployed
- [ ] `REACT_APP_API_URL` set to backend URL in frontend environment
- [ ] Test sending a message
- [ ] Check browser console for errors

---

## Example URLs After Deployment

- Backend: `https://chatbot-api.railway.app`
- Frontend: `https://chatbot-app.vercel.app`
- Frontend `.env`: `REACT_APP_API_URL=https://chatbot-api.railway.app`

