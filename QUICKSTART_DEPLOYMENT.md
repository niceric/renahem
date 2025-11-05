# Quick Start: Deploy to Vercel (15 minutes)

The fastest way to get your website live with working email!

## What You Need

- [x] GitHub account (you already have this)
- [ ] Vercel account (free - sign up with GitHub)
- [ ] SendGrid account (free - 100 emails/day)
- [ ] Your domain name (you have this)

---

## Step 1: Setup SendGrid (5 minutes)

1. **Go to** https://signup.sendgrid.com/
   - Choose free plan (100 emails/day)
   - Complete signup

2. **Verify Sender Email:**
   - Settings → Sender Authentication → Verify a Single Sender
   - Use: `noreply@renahem.se` or `info@renahem.se`
   - Check your email and verify

3. **Create API Key:**
   - Settings → API Keys → Create API Key
   - Name: "Rena Hem Website"
   - Permission: "Mail Send" (Full Access)
   - Copy the key (save it - you won't see it again!)

**Save these for later:**
```
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxx
EMAIL_TO=info@renahem.se
VERIFIED_SENDER=noreply@renahem.se
```

---

## Step 2: Deploy to Vercel (5 minutes)

### Option A: Using Vercel Dashboard (Easiest)

1. **Go to** https://vercel.com/signup
   - Sign up with GitHub
   - Authorize Vercel to access your repos

2. **Import Project:**
   - Click "Add New" → "Project"
   - Find your `renahem` repository
   - Click "Import"

3. **Configure:**
   - Framework Preset: **Other**
   - Root Directory: `./`
   - Build Command: `npm install`
   - Output Directory: `public`
   - Install Command: `npm install`

4. **Environment Variables:**
   - Click "Environment Variables"
   - Add these three:
     ```
     SENDGRID_API_KEY → [paste your key]
     EMAIL_TO → info@renahem.se
     VERIFIED_SENDER → noreply@renahem.se
     ```

5. **Deploy:**
   - Click "Deploy"
   - Wait 1-2 minutes
   - You'll get a URL like: `renahem-xxxxxx.vercel.app`

6. **Test:**
   - Visit the URL
   - Try the contact form
   - Check your email!

### Option B: Using Vercel CLI (For Developers)

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy
vercel

# 4. Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your username
# - Link to existing project? No
# - Project name? renahem
# - Directory? ./
# - Override settings? No

# 5. Add environment variables
vercel env add SENDGRID_API_KEY
vercel env add EMAIL_TO
vercel env add VERIFIED_SENDER

# 6. Deploy to production
vercel --prod
```

---

## Step 3: Connect Your Domain (5 minutes)

1. **In Vercel Dashboard:**
   - Go to your project
   - Settings → Domains
   - Click "Add"
   - Enter: `renahem.se`

2. **Vercel Will Show DNS Records** - Example:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   ```
   OR
   ```
   Type: CNAME
   Name: @
   Value: cname.vercel-dns.com
   ```

3. **Update DNS at Your Domain Registrar:**
   - Log into where you bought the domain
   - Find DNS settings
   - Add the records Vercel shows you
   - Save

4. **Add www Subdomain (Optional):**
   - In Vercel, also add `www.renahem.se`
   - Vercel handles the redirect automatically

5. **Wait for DNS Propagation:**
   - Usually 5-30 minutes
   - Check at https://www.whatsmydns.net

---

## Step 4: Verify Everything Works

### ✅ Checklist:

1. **Visit Your Domain:**
   - [ ] Website loads at renahem.se
   - [ ] HTTPS works (lock icon)
   - [ ] Logo appears
   - [ ] Mobile menu works

2. **Test Contact Form:**
   - [ ] Fill out form
   - [ ] Submit
   - [ ] See success message
   - [ ] Receive email (check spam too!)

3. **Test Features:**
   - [ ] Price calculator updates
   - [ ] Animations work
   - [ ] All links work
   - [ ] Responsive on mobile

---

## Troubleshooting

### "Can't connect to server" when submitting form:

**Check environment variables in Vercel:**
1. Go to Project → Settings → Environment Variables
2. Verify all three are set
3. Redeploy: Deployments → ⋯ → Redeploy

### Email not arriving:

1. **Check spam folder**
2. **Verify SendGrid sender:** Settings → Sender Authentication
3. **Check SendGrid Activity:** https://app.sendgrid.com/email_activity
4. **Test API key:** Should start with `SG.`

### Domain not connecting:

1. **Wait longer:** DNS can take up to 24 hours
2. **Check DNS:** https://www.whatsmydns.net
3. **Verify records match:** What Vercel shows = What you entered
4. **Remove old A records:** Delete conflicting DNS records

---

## Alternative: Quick Test Deploy

If you just want to test before connecting domain:

```bash
vercel
```

This gives you a `.vercel.app` URL immediately!
Test everything, then connect domain later.

---

## Updating Your Site Later

After making changes to your code:

```bash
git add .
git commit -m "Updated website"
git push
```

Vercel automatically redeploys! ✨

---

## Cost

- **SendGrid:** Free (100 emails/day)
- **Vercel:** Free (hobby plan)
- **Total:** $0/month

Upgrade only if you need:
- More emails (SendGrid paid plans)
- More bandwidth (Vercel Pro: $20/month)

---

## Next Steps After Deployment

1. **Setup Email Signature:**
   - Use same style as website
   - Include logo

2. **Google Analytics** (Optional):
   - Add tracking code to track visitors

3. **SEO:**
   - Submit to Google Search Console
   - Add meta descriptions

4. **Backups:**
   - Your code is in GitHub (already backed up!)

---

## Need Help?

**Vercel Issues:**
- https://vercel.com/docs
- https://vercel.com/support

**SendGrid Issues:**
- https://docs.sendgrid.com
- Check Activity Feed for errors

**Still Stuck?**
- Check browser console (F12)
- Look at Vercel deployment logs
- Verify environment variables are set
