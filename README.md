# Pathfinder — The Opportunity Engine

> Answer 8 questions. Get 100 curated opportunities matched to who you actually are.

Built by GAITECH Technology Services.

---

## What It Does

Users answer 8 questions about their field, dream, drive, and strengths. Claude generates 100 real, personalized opportunities — fellowships, jobs, scholarships, grants, communities, conferences, awards, and more — with a built-in Zapier/Make automation guide to send emails automatically.

---

## Project Structure

```
opportunity-engine/
├── api/
│   └── generate.js        ← Vercel serverless function (calls Claude)
├── src/
│   ├── App.jsx            ← Main app + loading screen
│   ├── main.jsx           ← React entry
│   ├── index.css          ← All styles
│   └── components/
│       ├── Intake.jsx     ← 8-question form
│       └── Results.jsx    ← 100 opportunity cards + automation modal
├── index.html
├── package.json
├── vite.config.js
└── vercel.json
```

---

## Deploy to Vercel (10 minutes)

### Step 1 — Get your Anthropic API key
1. Go to https://console.anthropic.com
2. Create an account / sign in
3. Go to **API Keys** → Create new key
4. Copy it — you'll need it in Step 4

### Step 2 — Push to GitHub
```bash
cd opportunity-engine
git init
git add .
git commit -m "Initial commit"
# Create a new repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/pathfinder.git
git push -u origin main
```

### Step 3 — Deploy on Vercel
1. Go to https://vercel.com → Sign up / Log in
2. Click **Add New Project**
3. Import your GitHub repo
4. Vercel auto-detects Vite — no config needed
5. Click **Deploy**

### Step 4 — Add your API key
1. In your Vercel project → **Settings** → **Environment Variables**
2. Add:
   - **Name:** `ANTHROPIC_API_KEY`
   - **Value:** `sk-ant-api03-...` (your key from Step 1)
3. Click **Save**
4. Go to **Deployments** → **Redeploy** (so it picks up the env var)

### Step 5 — Done ✓
Your site is live at `your-project.vercel.app`

---

## Connect to Zapier (Email Automation)

### What you need
- Zapier account (free tier works)
- Gmail connected to Zapier
- Anthropic or OpenAI connected to Zapier

### The Zap flow
```
Webhook (Catch Hook) 
  → Claude AI (Generate email from prompt)
    → Gmail (Send Email)
      → [Optional] Google Sheets (Log sent emails)
```

### Step by step
1. Create new Zap → Trigger: **Webhooks by Zapier** → **Catch Hook**
2. Copy the webhook URL Zapier gives you
3. Action 1: **Claude AI** or **ChatGPT** → use the prompt from the Automate modal on the site
4. Action 2: **Gmail** → **Send Email** → use AI output as the body
5. Add a **Delay** step (2 seconds) between emails to avoid spam flags
6. Turn on Zap

### Trigger the webhook
The site's "Automate" modal gives you the exact payload. You can trigger it via:
- A button on the site (future feature)
- Manually via Postman or curl
- From the MailBlast.AI tool (the other tool in this repo)

---

## Connect to Make.com (More Powerful)

### The scenario
```
Webhook → HTTP (Anthropic API) → Gmail → Google Sheets (log)
```

Use Make's **Iterator** module to loop through all 100 opportunities at once.

---

## Monetization Roadmap

**Stage 1 (Now):** Free for friends
**Stage 2:** Freemium — free to generate, paid to automate ($9-15/mo)
**Stage 3:** B2B — license to universities, NGOs, youth programs

---

## Environment Variables

| Variable | Description |
|---|---|
| `ANTHROPIC_API_KEY` | Your Anthropic API key from console.anthropic.com |

---

## Local Development

```bash
npm install
npm run dev
```

Note: The `/api/generate` route requires `ANTHROPIC_API_KEY` in a `.env.local` file:
```
ANTHROPIC_API_KEY=sk-ant-api03-...
```

---

Built with React + Vite + Vercel Edge Functions + Claude API.
>>>>>>> 31690876c05307183761ee1fa9530ab11ba8bcb8
