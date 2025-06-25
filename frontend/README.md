# Frontend - Online Shop

React TypeScript frontend for the online shop project.

## Quick Deploy to Vercel

1. **Connect to Vercel:**

   - Go to [vercel.com](https://vercel.com)
   - Import this repository
   - Set root directory to `frontend`

2. **Environment Variables:**

   ```
   VITE_API_URL=https://your-backend-domain.railway.app/api
   ```

3. **Build Settings:**
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

## Development

```bash
npm install
npm run dev
```

## Backend API

This frontend connects to a PHP backend API. Make sure to deploy the backend first and set the correct `VITE_API_URL`.

## Environment Variables

- `VITE_API_URL` - Backend API URL (required for production)
