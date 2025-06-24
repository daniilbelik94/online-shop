# 🚀 Deployment Guide

This guide provides multiple options for deploying your online shop as a live pet project that others can access and test.

## 📋 Quick Comparison

| Platform             | Cost         | Complexity | Best For             |
| -------------------- | ------------ | ---------- | -------------------- |
| **Railway**          | Free tier    | ⭐⭐       | Full-stack beginners |
| **Vercel + Railway** | Free tier    | ⭐⭐⭐     | Separated concerns   |
| **DigitalOcean**     | $12-25/month | ⭐⭐⭐⭐   | Production-ready     |
| **VPS**              | $5-20/month  | ⭐⭐⭐⭐⭐ | Full control         |

---

## 🚂 Option 1: Railway (Recommended for Pet Projects)

### Why Railway?

- ✅ **Free tier**: 500 execution hours/month
- ✅ **Easy setup**: Connect GitHub and deploy
- ✅ **Built-in database**: PostgreSQL included
- ✅ **Automatic deployments**: Push to main = deploy

### Step-by-Step Guide:

#### 1. Prepare Your Repository

```bash
# Make sure all deployment files are committed
git add .
git commit -m "Add production deployment configuration"
git push origin main
```

#### 2. Deploy to Railway

1. **Sign up**: Go to [railway.app](https://railway.app) and sign in with GitHub
2. **Create project**: Click "New Project" → "Deploy from GitHub repo"
3. **Select repository**: Choose your `online-shop` repository
4. **Add database**: In project dashboard, click "New" → "Database" → "PostgreSQL"

#### 3. Configure Environment Variables

In Railway dashboard, go to your service → Variables:

```env
APP_ENV=production
APP_DEBUG=false
JWT_SECRET=your-super-secure-256-bit-secret-key-min-32-chars
JWT_EXPIRATION=3600
VITE_API_URL=https://your-app-name.railway.app
```

#### 4. Update Database Connection

Railway automatically provides these variables:

- `DATABASE_URL` (use this for connection)
- `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD`

#### 5. Custom Domain (Optional)

- Go to Settings → Custom Domain
- Add your domain (e.g., `myshop.example.com`)

### Expected Result:

- **Live URL**: `https://your-app-name.railway.app`
- **Admin Panel**: `https://your-app-name.railway.app/admin`
- **API**: `https://your-app-name.railway.app/api/health`

---

## 🔷 Option 2: Vercel + Railway (Separated Services)

### Why This Approach?

- ✅ **Optimized**: Frontend on CDN, Backend on dedicated service
- ✅ **Scalable**: Independent scaling
- ✅ **Free**: Both platforms have free tiers

### Frontend on Vercel:

#### 1. Prepare Frontend

```bash
cd frontend
npm run build  # Test build locally
```

#### 2. Deploy to Vercel

1. **Sign up**: Go to [vercel.com](https://vercel.com) and connect GitHub
2. **Import project**: Click "New Project" → Select your repository
3. **Configure build**:
   - Framework Preset: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

#### 3. Add Environment Variables in Vercel

```env
VITE_API_URL=https://your-backend.railway.app
```

### Backend on Railway:

#### 1. Create Backend-Only Service

Use the `Dockerfile.backend` we created:

```dockerfile
# See Dockerfile.backend for complete configuration
FROM php:8.3-fpm
# ... (backend-only setup)
```

#### 2. Configure CORS

Update your backend to allow Vercel domain:

```php
// In backend/public/index.php
header('Access-Control-Allow-Origin: https://your-frontend.vercel.app');
```

---

## 🌊 Option 3: DigitalOcean App Platform

### Why DigitalOcean?

- ✅ **Production-ready**: Enterprise-grade infrastructure
- ✅ **Managed services**: Database, scaling, monitoring
- ✅ **Predictable pricing**: $12-25/month
- ✅ **Good performance**: Global CDN

### Step-by-Step Guide:

#### 1. Prepare Configuration

The `.do/app.yaml` file is already configured for your project.

#### 2. Deploy to DigitalOcean

1. **Sign up**: Create account at [digitalocean.com](https://digitalocean.com)
2. **Create app**: Go to Apps → Create App
3. **Connect GitHub**: Select your repository
4. **Review configuration**: DigitalOcean will detect the app.yaml

#### 3. Configure Environment Variables

In the DigitalOcean dashboard, add:

```env
JWT_SECRET=your-super-secure-256-bit-secret
APP_ENV=production
APP_DEBUG=false
```

#### 4. Custom Domain

- Add your domain in the Settings tab
- Configure DNS records as instructed

### Expected Cost:

- **Basic**: ~$12/month (backend + database)
- **Frontend**: ~$3/month
- **Total**: ~$15/month

---

## 🖥️ Option 4: VPS Deployment (Advanced)

### Why VPS?

- ✅ **Full control**: Complete server access
- ✅ **Cost-effective**: $5-20/month
- ✅ **Learning experience**: DevOps skills
- ✅ **Customizable**: Any configuration

### Providers:

- **DigitalOcean**: $6/month droplet
- **Linode**: $5/month nanode
- **Vultr**: $6/month instance
- **AWS Lightsail**: $5/month

### Quick Setup Script:

```bash
# On your VPS (Ubuntu 22.04)
#!/bin/bash

# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt install docker-compose-plugin -y

# Clone your repository
git clone https://github.com/daniilbelik94/online-shop.git
cd online-shop

# Create production environment
cp .env.example .env.production
# Edit .env.production with your settings

# Start services
docker-compose -f docker-compose.prod.yml up -d

# Setup SSL (optional)
# Install Certbot and configure HTTPS
```

---

## 🔄 GitHub Actions Automation

### What's Included:

The `.github/workflows/deploy.yml` provides:

- ✅ **Automated testing**: On every push
- ✅ **Type checking**: Frontend TypeScript
- ✅ **PHP syntax check**: Backend validation
- ✅ **Automated deployment**: To Railway/Vercel

### Setup GitHub Secrets:

In your GitHub repository → Settings → Secrets:

```env
# For Railway
RAILWAY_TOKEN=your-railway-api-token

# For Vercel
VERCEL_TOKEN=your-vercel-token
VERCEL_ORG_ID=your-org-id
VERCEL_PROJECT_ID=your-project-id
```

---

## 🎯 Recommended Workflow

### For Learning/Portfolio:

1. **Start with Railway**: Quick, free, full-stack
2. **Add custom domain**: Professional appearance
3. **Monitor usage**: Stay within free limits

### For Serious Projects:

1. **Use Vercel + Railway**: Better performance
2. **Add monitoring**: Sentry, LogRocket
3. **Implement CI/CD**: Automated testing and deployment

### For Production:

1. **DigitalOcean App Platform**: Managed infrastructure
2. **Custom domain + SSL**: Professional setup
3. **Backup strategy**: Database backups
4. **Monitoring**: Uptime, performance, errors

---

## 🛠️ Post-Deployment Checklist

### Security:

- [ ] Change default admin credentials
- [ ] Use strong JWT secret (256+ bits)
- [ ] Enable HTTPS/SSL
- [ ] Configure proper CORS
- [ ] Set secure database password

### Performance:

- [ ] Enable gzip compression
- [ ] Optimize images
- [ ] Add caching headers
- [ ] Monitor resource usage

### Monitoring:

- [ ] Set up uptime monitoring
- [ ] Configure error tracking
- [ ] Monitor database performance
- [ ] Track user analytics

### Documentation:

- [ ] Update README with live URL
- [ ] Document API endpoints
- [ ] Create user guide
- [ ] Share on social media

---

## 🔗 Live Demo Examples

Once deployed, your URLs will look like:

### Railway:

- **Frontend**: `https://your-app-name.railway.app`
- **API**: `https://your-app-name.railway.app/api/health`
- **Admin**: `https://your-app-name.railway.app/admin`

### Vercel + Railway:

- **Frontend**: `https://your-app.vercel.app`
- **API**: `https://your-backend.railway.app/api/health`
- **Admin**: `https://your-app.vercel.app/admin`

### Custom Domain:

- **Frontend**: `https://myshop.example.com`
- **API**: `https://api.myshop.example.com`
- **Admin**: `https://myshop.example.com/admin`

---

## 🆘 Troubleshooting

### Common Issues:

#### Database Connection Errors:

```bash
# Check environment variables
echo $DATABASE_URL

# Test connection manually
docker-compose exec php php -r "
$pdo = new PDO(getenv('DATABASE_URL'));
echo 'Connected successfully';
"
```

#### Build Failures:

```bash
# Clear cache and rebuild
docker-compose down
docker-compose build --no-cache
docker-compose up
```

#### CORS Issues:

```php
// Add to backend/public/index.php
header('Access-Control-Allow-Origin: https://your-frontend-domain.com');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
```

### Get Help:

- **Railway Discord**: [discord.gg/railway](https://discord.gg/railway)
- **Vercel Discord**: [discord.gg/vercel](https://discord.gg/vercel)
- **GitHub Issues**: Open an issue in your repository

---

## 💡 Pro Tips

1. **Start Simple**: Begin with Railway, migrate to more complex setups later
2. **Monitor Costs**: Set up billing alerts on paid platforms
3. **Use Staging**: Deploy to staging environment first
4. **Backup Strategy**: Regular database backups
5. **Performance**: Use CDN for static assets
6. **SEO**: Add meta tags and sitemap
7. **Analytics**: Google Analytics or Plausible
8. **Social Media**: Share your project on LinkedIn, Twitter

---

**Happy Deploying! 🚀**

Remember: The best deployment is the one that's live and accessible to users. Start simple and iterate!
