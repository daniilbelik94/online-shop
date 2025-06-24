# Railway Deployment Setup

## Current Issue

The application is deployed to Railway but shows database connection errors because PostgreSQL is not configured.

**Current Error:**

```
could not translate host name "db" to address: Name or service not known
```

## Solution Steps

### 1. Add PostgreSQL Database to Railway

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Open your project: `online-shop-production-1da0`
3. Click **"New"** → **"Database"** → **"Add PostgreSQL"**
4. Railway will automatically create the database and set environment variables

### 2. Environment Variables

Railway will automatically create these variables when you add PostgreSQL:

- `DB_HOST` - PostgreSQL host
- `DB_PORT` - PostgreSQL port (usually 5432)
- `DB_NAME` - Database name
- `DB_USERNAME` - Database username
- `DB_PASSWORD` - Database password

**Additional variables you need to set manually:**

- `JWT_SECRET` - Set to a secure random string (e.g., `your-super-secret-jwt-key-here`)
- `APP_ENV` - Set to `production`

### 3. Database Schema Setup

After adding the database, you need to create the tables. You can either:

**Option A: Use Railway's Web Terminal**

1. In Railway dashboard, go to your PostgreSQL service
2. Click "Connect" → "Query"
3. Run the SQL from `docker/postgres/init.sql`

**Option B: Connect via psql**

1. Get connection details from Railway dashboard
2. Connect using psql: `psql postgresql://username:password@host:port/database`
3. Run the SQL from `docker/postgres/init.sql`

### 4. Verify Deployment

After setting up the database:

1. Railway will automatically redeploy your application
2. Check the logs in Railway dashboard
3. Test the API endpoints:
   - Health check: `https://online-shop-production-1da0.up.railway.app/api/health`
   - Products: `https://online-shop-production-1da0.up.railway.app/api/products`

### 5. Frontend Configuration

The frontend is configured to use the Railway backend URL:

- **Backend URL:** `https://online-shop-production-1da0.up.railway.app`
- **Frontend (Vercel):** Will be deployed automatically via GitHub Actions

## Current Status

✅ **Backend deployed to Railway** - `https://online-shop-production-1da0.up.railway.app`  
❌ **Database not configured** - Need to add PostgreSQL  
✅ **Frontend ready for deployment** - Will work once backend database is ready  
✅ **Error handling improved** - Frontend won't crash on API errors

## Next Steps

1. **Add PostgreSQL to Railway** (most important)
2. **Set environment variables** in Railway dashboard
3. **Run database migrations** to create tables
4. **Test the full application**

Once the database is configured, both frontend and backend will work properly.
