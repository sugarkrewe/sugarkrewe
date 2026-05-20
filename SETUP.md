# 🎷 Sugar Krewe — Stripe + Netlify Setup Guide

## What's in this folder

```
sugarkrewe/
├── src/
│   ├── App.jsx          ← Your full website (all 6 products + cart)
│   └── main.jsx         ← React entry point
├── netlify/
│   └── functions/
│       └── create-checkout.js  ← Stripe backend (runs on Netlify)
├── index.html
├── package.json
├── vite.config.js
├── netlify.toml
└── SETUP.md             ← You are here
```

---

## STEP 1 — Get your Stripe keys (free, 5 min)

1. Go to **stripe.com** → create a free account
2. In the Stripe dashboard, click **Developers** → **API Keys**
3. Copy your **Secret key** (starts with `sk_live_...`)
   - Use `sk_test_...` first to test without real charges

---

## STEP 2 — Install & build locally

Open your terminal in this folder and run:

```bash
npm install
npm run build
```

This creates a `dist/` folder — your ready-to-deploy site.

---

## STEP 3 — Deploy to Netlify

1. Go to **netlify.com** → Log in → **Add new site** → **Deploy manually**
2. Drag and drop the **entire project folder** (not just `dist`) — this lets Netlify run your function too
   - OR: Connect your GitHub repo for auto-deploys on every push

---

## STEP 4 — Add your Stripe secret key to Netlify

This is critical — never put your secret key in code!

1. In Netlify dashboard → your site → **Site configuration** → **Environment variables**
2. Click **Add a variable**:
   - Key: `STRIPE_SECRET_KEY`
   - Value: `sk_live_XXXXXXXXXXXXXXXX` (your key from Step 1)
3. Click **Save**
4. **Redeploy** your site (Netlify → Deploys → Trigger deploy)

---

## STEP 5 — Test it!

1. Open your Netlify URL (e.g. `sugarkrewe.netlify.app`)
2. Add a product to your bag
3. Click **Checkout with Stripe**
4. You'll be redirected to Stripe's secure checkout page
5. Use test card `4242 4242 4242 4242` (any future date, any CVV) to test

---

## STEP 6 — Go live with real payments

1. In Stripe dashboard → toggle from **Test mode** to **Live mode**
2. Copy your **live** secret key (`sk_live_...`)
3. Update the `STRIPE_SECRET_KEY` environment variable in Netlify
4. Redeploy — you're live! 💰

---

## OPTIONAL — Custom domain (sugarkrewe.com)

1. In Netlify → **Domain management** → **Add custom domain**
2. Type `sugarkrewe.com`
3. Follow the DNS instructions (update your domain registrar's nameservers)
4. Netlify gives you a free SSL certificate automatically

---

## How orders work

When a customer checks out:
1. Your site calls the Netlify function (`/netlify/functions/create-checkout`)
2. The function creates a Stripe Checkout Session with their items
3. Customer is redirected to Stripe's hosted payment page (ultra secure)
4. After payment, Stripe sends them back to your site
5. You get an email + see the order in your **Stripe dashboard**

---

## Getting paid

- Stripe deposits to your bank account automatically
- Default: 2-day rolling deposits
- Set up in Stripe dashboard → **Settings** → **Payouts**

---

## Need help?

Email: Sugarkrewe@gmail.com
Stripe docs: docs.stripe.com
Netlify docs: docs.netlify.com

🎷 LAISSEZ LES BONS TEMPS ROULER!
