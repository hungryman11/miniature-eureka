# Pathfinder — The Opportunity Engine

> Answer 8 questions. Get 100 perfectly-matched opportunities.

Built by GAITECH Technology Services.

---

## What It Does

Users answer 8 questions about their field, dream, drive, and strengths. Our smart matching engine returns 100 real, personalized opportunities — fellowships, jobs, scholarships, grants, communities, conferences, awards, and more — with instant results and email automation.

---

## New Cost-Effective Architecture

**Before:** Claude AI generated 100 opportunities per user = 💸💸💸
**After:** Smart scoring algorithm matches from curated dataset = 💚 FREE

### How it works:
1. **Dataset Layer**: 100+ real opportunities manually curated
2. **Matching Engine**: Scores opportunities based on your profile (no AI)
3. **Personalization**: AI generates custom explanations and emails (optional)

---

## Project Structure

```
opportunity-engine/
├── api/
│   ├── match.js              ← Smart matching engine (FREE)
│   ├── generate-email.js     ← Email personalization (optional)
│   └── data/
│       └── opportunities.json ← Curated opportunities dataset
├── src/
│   ├── App.jsx               ← Main app + instant results
│   ├── main.jsx              ← React entry
│   ├── index.css             ← All styles
│   └── components/
│       ├── Intake.jsx        ← 8-question form
│       └── Results.jsx       ← 100 opportunity cards + automation modal
├── index.html
├── package.json
├── vite.config.js
└── vercel.json
```

---

## Deploy to Vercel (5 minutes)

### Step 1 — Push to GitHub
```bash
cd opportunity-engine
git add .
git commit -m "Cost-effective opportunity matching engine"
git push origin main
```

### Step 2 — Deploy on Vercel
1. Go to https://vercel.com → Sign up / Log in
2. Click **Add New Project**
3. Import your GitHub repo
4. Vercel auto-detects Vite — no config needed
5. Click **Deploy**

### Step 3 — Done ✓
Your site is live! No API keys needed for basic matching.

---

## Optional: Email Automation

For email personalization, add Gemini API key:

1. Get API key from https://console.cloud.google.com/apis/credentials
2. In Vercel project → **Settings** → **Environment Variables**
3. Add: `GEMINI_API_KEY` = `...`
4. Redeploy

### Free automation alternative

Use **n8n** or **Make.com** free tiers to automate email sending from your own Gmail account.

---

## Local Development

```bash
npm install
npm run dev
```

---

## Monetization Strategy

### Free Tier (What you have now):
- 100 perfectly-matched opportunities
- Instant results
- No API costs

### Premium Features:
- Email automation ($10–20/month)
- Priority support
- Advanced filtering

### B2B:
- White-label for universities
- Custom datasets
- Bulk matching

---

Built with React + Vite + Vercel + Smart Matching Algorithm.
