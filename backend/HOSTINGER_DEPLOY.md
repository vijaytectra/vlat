# VLAT Backend - Hostinger VPS Deployment Guide (10 Minutes)

## Prerequisites

- SSH access to Hostinger VPS (IP: 157.173.218.57)
- Node.js 18+ installed on VPS
- PM2 installed globally
- Your domain: thelead101.com (adding vlat.api subdomain)

---

## STEP 1: DNS Setup (Do this FIRST - takes time to propagate)

### In Hostinger hPanel → DNS Manager:

Add this A record for the subdomain:

```
Type: A
Name: vlat.api
Points to: 157.173.218.57
TTL: 14400 (or default)
```

Your API will be accessible at: `vlat.api.thelead101.com`

---

## STEP 2: SSH into VPS

```bash
ssh root@157.173.218.57
```

---

## STEP 3: Create Project Directory

```bash
# Navigate to your projects folder (adjust path if different)
cd /var/www

# Create vlat directory
mkdir -p vlat-backend
cd vlat-backend
```

---

## STEP 4: Upload Files (from your local machine)

**Option A: Using SCP (recommended)**
Open NEW terminal on your local machine (PowerShell):

```powershell
cd "C:\Users\Vijayakumar R\Desktop\vlat\backend"

# Upload all files (PowerShell syntax - includes node_modules, but npm install will overwrite)
scp -r package.json package-lock.json server.js local-server.js ecosystem.config.js api config controllers middleware models routes utils root@157.173.218.57:/var/www/vlat-backend/
```

**Note:** If using Git Bash instead of PowerShell, you can use: `scp -r !(node_modules) root@157.173.218.57:/var/www/vlat-backend/`

**Option B: Using Git (if repo exists)**

```bash
# On VPS
cd /var/www/vlat-backend
git clone https://github.com/yourusername/vlat-backend.git .
```

**Option C: Using FileZilla/SFTP**

- Connect to 157.173.218.57 via SFTP
- Upload all files to /var/www/vlat-backend/
- DO NOT upload node_modules folder

---

## STEP 5: Install Dependencies (on VPS)

```bash
cd /var/www/vlat-backend

# Install production dependencies
npm install --production

# Create logs directory
mkdir -p logs
```

---

## STEP 6: Create Environment File (on VPS)

```bash
nano .env
```

Paste this (update with YOUR values):

```env
NODE_ENV=production
PORT=3000

# Your MongoDB URI
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/vlat?retryWrites=true&w=majority

# Generate secrets with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=paste-generated-secret-here
SESSION_SECRET=paste-another-generated-secret-here

# Your frontend URL
FRONTEND_URL=https://vlat.vercel.com

# Email - Use Nodemailer SMTP (works perfectly on VPS!)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM=your-email@gmail.com

# OR use Resend API
# RESEND_API_KEY=re_xxxxxxxxxxxx
```

Save: `Ctrl+X`, then `Y`, then `Enter`

---

## STEP 7: Start with PM2

```bash
# Start the application
pm2 start ecosystem.config.js --env production

# Save PM2 configuration (auto-restart on reboot)
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Run the command it outputs!

# Check status
pm2 status

# View logs
pm2 logs vlat-backend
```

---

## STEP 8: Configure Nginx Reverse Proxy

```bash
# Create Nginx config for vlat.api subdomain
sudo nano /etc/nginx/sites-available/vlat-api
```

Paste this configuration:

```nginx
server {
    listen 80;
    server_name vlat.api.thelead101.com;

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
        proxy_read_timeout 86400;
    }
}
```

Save and enable:

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/vlat-api /etc/nginx/sites-enabled/

# Test Nginx config
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

## STEP 9: Install SSL Certificate (HTTPS)

```bash
# Install Certbot if not installed
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d vlat.api.thelead101.com

# Follow the prompts (enter email, agree to terms)
```

---

## STEP 10: Test Your Deployment

```bash
# Test health endpoint
curl https://vlat.api.thelead101.com/api/health
```

Expected response:

```json
{ "success": true, "message": "Server is running" }
```

---

## Updating Files After Initial Deployment

After making code changes, you need to upload the updated files and restart PM2.

### Quick Single File Update

**From your local machine (PowerShell):**

```powershell
cd "C:\Users\Vijayakumar R\Desktop\vlat\backend"

# Upload a single file
scp api/index.js root@157.173.218.57:/var/www/vlat-backend/api/
```

**Then on VPS, restart PM2:**

```bash
ssh root@157.173.218.57
cd /var/www/vlat-backend
pm2 restart vlat-backend

# Verify it's running
pm2 status
pm2 logs vlat-backend --lines 20
```

### Upload Multiple Files/Folders

```powershell
cd "C:\Users\Vijayakumar R\Desktop\vlat\backend"

# Upload specific files
scp api/index.js server.js root@157.173.218.57:/var/www/vlat-backend/

# Upload entire folders
scp -r routes controllers utils root@157.173.218.57:/var/www/vlat-backend/
```

**Then restart on VPS:**

```bash
pm2 restart vlat-backend
```

### Important: Update CORS Origins

If you add new frontend domains, update `api/index.js` or `server.js`:

```javascript
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://vlat.thelead101.com",      // Add your production frontend
  "https://vlat.api.thelead101.com",  // Add if needed
  // ... other origins
].filter(Boolean);
```

After updating, upload the file and restart PM2.

### If You Added New Dependencies

If `package.json` changed (new npm packages):

```bash
# On VPS
cd /var/www/vlat-backend

# Upload new package.json first
# (from local: scp package.json root@157.173.218.57:/var/www/vlat-backend/)

# Install new dependencies
npm install --omit=dev

# Restart
pm2 restart vlat-backend
```

---

## Quick Commands Reference

```bash
# View logs
pm2 logs vlat-backend

# Restart app
pm2 restart vlat-backend

# Stop app
pm2 stop vlat-backend

# Check status
pm2 status

# Reload after code changes
pm2 reload vlat-backend

# View Nginx logs
sudo tail -f /var/log/nginx/error.log
```

---

## Troubleshooting

### App not starting?

```bash
pm2 logs vlat-backend --lines 50
```

### Port already in use?

```bash
lsof -i :3000
kill -9 <PID>
```

### Nginx not working?

```bash
sudo nginx -t
sudo systemctl status nginx
```

### SSL issues?

```bash
sudo certbot renew --dry-run
```

### MongoDB connection failed?

- Check your MongoDB Atlas IP whitelist includes 157.173.218.57
- Or whitelist 0.0.0.0/0 (allow from anywhere)

---

## Update Your Frontend

After deployment, update your frontend API URL to:

```javascript
const API_URL = "https://vlat.api.thelead101.com";
```

---

## Nodemailer SMTP Setup (Gmail)

1. Enable 2FA on Gmail: https://myaccount.google.com/security
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use the 16-character app password as SMTP_PASSWORD

---

## Security Checklist

- [ ] .env file has correct permissions: `chmod 600 .env`
- [ ] MongoDB Atlas IP whitelist updated
- [ ] SSL certificate installed
- [ ] Firewall allows ports 80, 443, 22
- [ ] PM2 set to auto-start on boot

---

**Your API will be live at: https://vlat.api.thelead101.com**
