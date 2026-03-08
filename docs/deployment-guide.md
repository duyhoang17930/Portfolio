# Portfolio Deployment Guide

Step-by-step guide to deploy your Portfolio application with:
- **Frontend**: Vercel
- **Backend**: Google Cloud VPS with Docker, PM2
- **Database**: MongoDB (Atlas or self-hosted)
- **Cache**: Redis
- **Reverse Proxy**: Nginx with Let's Encrypt SSL

---

## Prerequisites

### Required Accounts
- [Vercel](https://vercel.com) account (free)
- [Google Cloud](https://cloud.google.com) account
- [MongoDB Atlas](https://www.mongodb.com/atlas/database) account (or self-hosted)
- [Redis Cloud](https://redis.com/redis-cloud/) account (free tier) or self-hosted
- Domain name (optional, for HTTPS)

### Local Tools
```bash
# Install Docker Desktop
# https://www.docker.com/products/docker-desktop

# Install Google Cloud CLI
# https://cloud.google.com/sdk/docs/install

# Install Node.js 20+
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install pnpm (required for backend)
npm install -g pnpm
```

---

## Part 1: Deploy Frontend to Vercel

### Step 1.1: Connect GitHub to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Select the `FE` folder as the project root

### Step 1.2: Configure Environment Variables
In Vercel project settings, add:
```
VITE_API_URL=https://your-backend-domain.com/api
```

### Step 1.3: Deploy
1. Click "Deploy"
2. Wait for build to complete
3. Get your Vercel URL (e.g., `your-portfolio.vercel.app`)

---

## Part 2: Google Cloud VPS Setup

### Step 2.1: Create Google Cloud Account
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (e.g., `portfolio-prod`)

### Step 2.2: Create Virtual Machine Instance
1. Navigate to **Compute Engine** → **VM Instances**
2. Click **Create Instance**
3. Configure:
   - Name: `portfolio-backend`
   - Region: Choose closest to your users
   - Machine type: `e2-medium` (2 vCPU, 4GB RAM - sufficient for personal portfolio)
   - Boot disk: Ubuntu 22.04 LTS (20GB SSD)
   - Firewall: Allow HTTP, HTTPS, SSH

4. Click **Create**
5. Note the **External IP** address

### Step 2.3: Connect to VPS via SSH
```bash
# From your local terminal
gcloud compute ssh portfolio-backend --zone=your-zone
```

### Step 2.4: Initial Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install essential tools
sudo apt install -y curl wget git vim unzip software-properties-common

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install pnpm (required for backend)
npm install -g pnpm

# Verify installation
node --version  # Should show v20.x.x
pnpm --version
```

### Step 2.5: Install Docker
```bash
# Install Docker
sudo apt install -y docker.io docker-compose-plugin

# Enable and start Docker
sudo systemctl enable docker
sudo systemctl start docker

# Add user to docker group (logout required after)
sudo usermod -aG docker $USER

# Verify Docker
docker --version
docker-compose --version
```

### Step 2.6: Install PM2
```bash
sudo npm install -g pm2

# Setup PM2 startup script
pm2 startup
# Follow the output command (e.g., sudo env PATH=... pm2 startup ...)
```

---

## Part 3: MongoDB Setup

### Option A: MongoDB Atlas (Recommended for Beginners)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas/database)
2. Create free cluster:
   - Provider: AWS/Google Cloud
   - Region: Closest to your VPS
   - Cluster Tier: Free (M0)

3. Create database user:
   - Username: `portfolio_admin`
   - Password: Generate strong password, save it!

4. Network Access:
   - Add IP: `0.0.0.0/0` (allow all IPs) or your VPS IP

5. Get connection string:
   - Click "Connect" → "Connect your application"
   - Copy URI: `mongodb+srv://portfolio_admin:<password>@cluster.mongodb.net/portfolio`

### Option B: Self-Hosted MongoDB on VPS
```bash
# Install MongoDB
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt update
sudo apt install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod

# Connection string (local)
MONGO_URI=mongodb://localhost:27017/portfolio
```

---

## Part 4: Redis Setup

### Option A: Redis Cloud (Recommended)

1. Go to [Redis Cloud](https://redis.com/redis-cloud/)
2. Create free subscription:
   - Provider: AWS/Google Cloud
   - Plan: Free (30MB)

3. Get connection details:
   - Endpoint: `redis-cloud-xxxxx.cloud.redislabs.com`
   - Port: `xxxxx`
   - Password: Your Redis password

### Option B: Self-Hosted Redis on VPS
```bash
# Install Redis
sudo apt install -y redis-server

# Configure Redis (bind to localhost)
sudo nano /etc/redis/redis.conf
# Find: bind 127.0.0.1 ::1
# Keep as is for security

# Start Redis
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Test connection
redis-cli ping  # Should return PONG
```

---

## Part 5: Backend Docker Setup

The Docker files are already included in your BE folder:
- `BE/Dockerfile` - Multi-stage build with pnpm
- `BE/docker-compose.yml` - Container orchestration
- `BE/.dockerignore` - Excludes unnecessary files from build

### Step 5.1: Create .env Production File
Create `BE/.env` on your server:
```bash
# Server
NODE_ENV=production
PORT=3000
FE_URL=https://your-vercel-domain.vercel.app

# Database (Atlas or local)
MONGO_URI=mongodb+srv://portfolio_admin:YOUR_PASSWORD@cluster.mongodb.net/portfolio

# Session (generate with: openssl rand -base64 32)
SESSION_SECRET=your-super-secret-session-key-here

# OAuth (from Google Cloud Console & GitHub Developer Settings)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=https://your-domain.com/auth/google/callback

GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_CALLBACK_URL=https://your-domain.com/auth/github/callback

# Email
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your-app-password
CONTACT_TO_EMAIL=your-email@gmail.com

# Redis
REDIS_URL=redis://username:password@redis-host:port
```

### Step 5.4: Build and Run Docker
```bash
# Navigate to backend directory
cd /home/yourusername/portfolio/BE

# Build Docker image
docker-compose build

# Run container
docker-compose up -d

# Check logs
docker-compose logs -f

# Check container status
docker-compose ps
```

---

## Part 6: PM2 Setup (Alternative to Docker)

If you prefer running directly without Docker:

```bash
# Navigate to backend
cd /home/yourusername/portfolio/BE

# Install production dependencies
npm ci --omit=dev

# Create ecosystem.config.js
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'portfolio-backend',
    script: 'dist/server.js',
    instances: 1,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s'
  }]
}
EOF

# Create logs directory
mkdir -p logs

# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 process list
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the instructions to run the generated command
```

---

## Part 7: Nginx Setup

### Step 7.1: Install Nginx
```bash
sudo apt install -y nginx
```

### Step 7.2: Create Nginx Config
```bash
sudo nano /etc/nginx/sites-available/portfolio-backend
```

Paste this configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Redirect to HTTPS (after SSL setup)
    # return 301 https://$server_name$request_uri;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300;
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
    }
}
```

### Step 7.3: Enable Site
```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/portfolio-backend /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

---

## Part 8: Let's Encrypt SSL (Free HTTPS)

### Step 8.1: Install Certbot
```bash
sudo apt install -y certbot python3-certbot-nginx
```

### Step 8.2: Obtain SSL Certificate
```bash
# Replace with your actual domain
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Follow the prompts:
# - Enter email for renewal notifications
# - Agree to Terms of Service
# - Choose whether to redirect HTTP to HTTPS (recommended: 2)
```

### Step 8.3: Verify SSL
- Visit: `https://your-domain.com`
- Check SSL certificate at: `https://www.ssllabs.com/ssltest/analyze.html`

### Step 8.4: Auto-Renewal (Certbot does this automatically)
```bash
# Test renewal
sudo certbot renew --dry-run
```

---

## Part 9: Update OAuth Redirect URIs

After getting your domain, update OAuth callback URLs:

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to APIs & Services → Credentials
3. Edit your OAuth client
4. Add to **Authorized redirect URIs**:
   ```
   https://your-domain.com/auth/google/callback
   ```

### GitHub OAuth
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Edit your OAuth App
3. Update **Authorization callback URL**:
   ```
   https://your-domain.com/auth/github/callback
   ```

---

## Part 10: Update Vercel Environment Variables

In your Vercel project settings, update:
```
VITE_API_URL=https://your-domain.com/api
```

---

## Part 11: Verify Deployment

### Check Backend
```bash
# Check Docker/PM2 status
docker-compose ps    # Docker
pm2 status           # PM2

# Check logs
docker-compose logs -f backend   # Docker
pm2 logs portfolio-backend       # PM2

# Test API
curl https://your-domain.com/api/health
```

### Check Frontend
1. Visit `https://your-domain.com` (if using same domain)
2. Or visit `https://your-portfolio.vercel.app`

---

## Maintenance Commands

### Backend Updates
```bash
# Docker
docker-compose pull
docker-compose up -d --build

# PM2
cd /home/yourusername/portfolio/BE
git pull
npm run build
pm2 restart portfolio-backend
```

### Logs
```bash
# Docker
docker-compose logs -f

# PM2
pm2 logs --lines 100

# Nginx
sudo tail -f /var/log/nginx/error.log
```

### Backups
- **MongoDB Atlas**: Automatic daily backups included in free tier
- **MongoDB Local**: `mongodump --db=portfolio --out=/backup/`
- **Code**: Use Git

---

## Troubleshooting

### Common Issues

1. **502 Bad Gateway**
   - Check if backend is running: `docker-compose ps` or `pm2 list`
   - Check logs: `docker-compose logs` or `pm2 logs`

2. **MongoDB Connection Error**
   - Verify MONGO_URI in .env
   - Check IP whitelist in MongoDB Atlas

3. **OAuth Not Working**
   - Verify callback URLs in OAuth settings
   - Check GOOGLE_CLIENT_ID/SECRET in .env

4. **SSL Certificate Issues**
   - Renew: `sudo certbot renew`
   - Reinstall: `sudo certbot delete` then `sudo certbot --nginx`

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Internet                              │
└─────────────────┬───────────────────────┬───────────────────┘
                  │                       │
                  ▼                       ▼
        ┌───────────────┐       ┌─────────────────┐
        │    Vercel     │       │  Google Cloud   │
        │   (Frontend)  │       │      VPS        │
        │               │       │                 │
        │  React +     │       │  ┌───────────┐  │
        │  Tailwind    │──────▶│  │  Nginx    │  │
        │               │       │  │  (Port 80)│  │
        └───────────────┘       │  └─────┬─────┘  │
                                 │        │         │
                                 │  ┌─────▼─────┐  │
                                 │  │  Backend  │  │
                                 │  │ Express   │  │
                                 │  └─────┬─────┘  │
                                 │        │         │
                                 │  ┌─────┴─────┐  │
                                 │  │ Docker/PM2 │  │
                                 │  └─────┬─────┘  │
                                 │        │         │
                                 └────────┼─────────┘
                                          │
                    ┌─────────────────────┼─────────────────────┐
                    │                     │                     │
                    ▼                     ▼                     ▼
            ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
            │  MongoDB    │     │   Redis     │     │    Logs    │
            │   Atlas     │     │   Cloud     │     │   Files    │
            └─────────────┘     └─────────────┘     └─────────────┘
```

---

## Quick Reference

| Service | URL/Port |
|---------|----------|
| Frontend (Vercel) | `https://your-portfolio.vercel.app` |
| Backend (Nginx) | `https://your-domain.com` |
| API | `https://your-domain.com/api` |
| MongoDB | `mongodb+srv://...` |
| Redis | `redis://...` |

---

## Next Steps

1. Set up monitoring (optional):
   - [PM2 Plus](https://pm2.io/plus/) - Free for 2 servers
   - [UptimeRobot](https://uptimerobot.com/) - Free monitoring

2. Set up CI/CD (optional):
   - GitHub Actions to auto-deploy on push

3. Security hardening:
   - Configure firewall: `sudo ufw allow 22,80,443/tcp`
   - Use fail2ban: `sudo apt install fail2ban`
