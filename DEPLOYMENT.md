# Deployment Guide - Rena Hem Website

This guide covers different deployment options for your website with working contact form email functionality.

## Important: Backend Requirement

Your website needs **Node.js hosting** because the contact form requires a backend server to send emails. You cannot use basic static hosting (like simple FTP upload).

## Before Deploying

1. **Get SendGrid API Key**
   - Sign up at https://sendgrid.com (free tier: 100 emails/day)
   - Verify your sender email
   - Create API key with "Mail Send" permissions

2. **Have Your Domain Ready**
   - Domain registered and accessible
   - Access to DNS settings

---

## Option 1: Vercel (Recommended - Easiest)

**Best for:** Simple deployment, automatic HTTPS, free tier

### Steps:

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Create `vercel.json` config** (already in project)

3. **Deploy:**
   ```bash
   vercel
   ```

4. **Set Environment Variables:**
   ```bash
   vercel env add SENDGRID_API_KEY
   vercel env add EMAIL_TO
   vercel env add VERIFIED_SENDER
   ```

5. **Connect Your Domain:**
   - Go to Vercel dashboard → Settings → Domains
   - Add your domain (e.g., renahem.se)
   - Update DNS records as instructed

**Pros:** Free, easy, automatic HTTPS, Git integration
**Cons:** 100GB bandwidth/month limit on free tier

---

## Option 2: Railway (Great Node.js Hosting)

**Best for:** Simple Node.js apps, generous free tier

### Steps:

1. **Sign up at** https://railway.app

2. **Create New Project:**
   - Connect your GitHub repository
   - Railway auto-detects Node.js

3. **Set Environment Variables:**
   - Go to project → Variables
   - Add: `SENDGRID_API_KEY`, `EMAIL_TO`, `VERIFIED_SENDER`, `PORT=3000`

4. **Deploy:**
   - Railway automatically deploys from your Git repo
   - Get your railway.app URL

5. **Add Custom Domain:**
   - Settings → Add Custom Domain
   - Update DNS: CNAME record pointing to your Railway domain

**Pros:** $5 free credit/month, easy to use, great for Node.js
**Cons:** No free tier after trial credit expires

---

## Option 3: Render (Free Node.js Hosting)

**Best for:** Free hosting with custom domains

### Steps:

1. **Sign up at** https://render.com

2. **Create Web Service:**
   - New → Web Service
   - Connect GitHub repository
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Set Environment Variables:**
   - Environment tab
   - Add: `SENDGRID_API_KEY`, `EMAIL_TO`, `VERIFIED_SENDER`

4. **Connect Domain:**
   - Settings → Custom Domain
   - Add renahem.se
   - Update DNS as instructed

**Pros:** Free tier available, automatic HTTPS
**Cons:** Free tier may spin down after inactivity (slow first load)

---

## Option 4: DigitalOcean App Platform

**Best for:** Scalable hosting, $5/month

### Steps:

1. **Sign up at** https://digitalocean.com

2. **Create App:**
   - Apps → Create App
   - Connect GitHub
   - Choose Node.js

3. **Configure:**
   - Build Command: `npm install`
   - Run Command: `npm start`
   - Port: 3000

4. **Environment Variables:**
   - Settings → App-Level Environment Variables
   - Add SendGrid credentials

5. **Add Domain:**
   - Settings → Domains → Add Domain

**Pros:** Reliable, scalable, good support
**Cons:** Costs $5/month (no free tier)

---

## Option 5: Traditional VPS (If You Already Have Hosting)

**Best for:** If you already have a VPS or server with SSH access

### Requirements:
- SSH access to server
- Node.js installed (v18+)
- Nginx or Apache for reverse proxy
- PM2 for process management

### Steps:

1. **SSH into your server:**
   ```bash
   ssh user@your-server.com
   ```

2. **Install Node.js** (if not installed):
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Install PM2:**
   ```bash
   sudo npm install -g pm2
   ```

4. **Upload your code:**
   ```bash
   # On your local machine
   rsync -avz --exclude 'node_modules' ./ user@your-server.com:/var/www/renahem/
   ```

5. **On the server, install dependencies:**
   ```bash
   cd /var/www/renahem
   npm install --production
   ```

6. **Create `.env` file on server:**
   ```bash
   nano .env
   ```
   Add your environment variables

7. **Start with PM2:**
   ```bash
   pm2 start server/server.js --name renahem
   pm2 save
   pm2 startup
   ```

8. **Configure Nginx reverse proxy:**
   ```bash
   sudo nano /etc/nginx/sites-available/renahem
   ```

   Add:
   ```nginx
   server {
       listen 80;
       server_name renahem.se www.renahem.se;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

9. **Enable site and restart Nginx:**
   ```bash
   sudo ln -s /etc/nginx/sites-available/renahem /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

10. **Setup SSL with Let's Encrypt:**
    ```bash
    sudo apt install certbot python3-certbot-nginx
    sudo certbot --nginx -d renahem.se -d www.renahem.se
    ```

**Pros:** Full control, can use existing hosting
**Cons:** More complex, requires server management knowledge

---

## Option 6: Shared Hosting with Node.js Support

**If your current hosting provider supports Node.js:**

Some shared hosting providers like:
- Hostinger (supports Node.js on some plans)
- A2 Hosting (Node.js support)
- DreamHost (VPS with Node.js)

Check if your provider has:
- Node.js support
- SSH access
- Ability to run custom applications

Follow their specific Node.js deployment guide.

---

## DNS Configuration

Regardless of hosting choice, you'll need to update DNS:

### For Vercel/Railway/Render:
- **A Record** or **CNAME**: Points to hosting provider
- Example:
  ```
  Type: A
  Name: @ (or renahem.se)
  Value: [IP from hosting provider]
  TTL: 3600
  ```

### Add www subdomain:
```
Type: CNAME
Name: www
Value: renahem.se
TTL: 3600
```

---

## Post-Deployment Checklist

- [ ] Website loads at your domain
- [ ] HTTPS is working (lock icon in browser)
- [ ] Contact form can be submitted
- [ ] Email arrives at your EMAIL_TO address
- [ ] Mobile menu works
- [ ] Price calculator works
- [ ] All images load correctly

---

## Testing the Deployed Site

1. **Test Contact Form:**
   - Go to your live site
   - Fill out contact form
   - Submit
   - Check that you receive the email

2. **Check Browser Console:**
   - Press F12
   - Look for any errors
   - Check Network tab for failed requests

3. **Test on Mobile:**
   - View site on phone
   - Test mobile menu
   - Submit contact form

---

## Troubleshooting

### Contact Form Not Working:

1. **Check Environment Variables:**
   - Make sure all three variables are set on hosting platform
   - No typos in variable names

2. **Check SendGrid:**
   - Verify sender email is confirmed
   - API key has "Mail Send" permission
   - Check SendGrid dashboard for error logs

3. **Check Browser Console:**
   - F12 → Console tab
   - Look for "Network error" or CORS issues

4. **Check API URL:**
   - In `public/js/main.js`, line 4
   - Should be empty string `''` for production (same domain)
   - Or full URL if separate backend domain

### Common Issues:

- **CORS Error:** Backend needs CORS middleware (already included)
- **503 Error:** Server not running or crashed
- **404 on form submit:** API route not found, check server.js
- **No email received:** Check spam folder, verify SendGrid setup

---

## Recommended: Start with Vercel

For easiest deployment:
1. Push code to GitHub (already done ✓)
2. Sign up at vercel.com
3. Import your GitHub repo
4. Add environment variables
5. Connect your domain

Total time: ~15 minutes

---

## Need Help?

If you get stuck, provide:
- Which hosting option you chose
- Any error messages
- Browser console logs (F12)
