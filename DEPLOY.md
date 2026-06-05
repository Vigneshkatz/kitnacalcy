# Deploy guide — All-in-One Financial Calculator

You have two things in this folder:
- `index.html` — the full single-file app (works on its own).
- `dist/` — the **SEO build**: 24 calculator pages + home + `sitemap.xml` + `robots.txt`.
  Built by running `node build.js`. **Deploy `dist/` for the real site** (it ranks per calculator).

---

## Option A — Netlify Drop (fastest, ~60 seconds, no account needed)

1. Run the build: `node build.js`
2. Go to https://app.netlify.com/drop
3. Drag the **`dist`** folder onto the page → you instantly get a URL like `random-name.netlify.app`.
4. (Optional) In **Site settings → Change site name**, pick something memorable.
5. Copy your final URL, set it as `BASE_URL` at the top of `build.js`, run `node build.js` again, and drag `dist` once more (this fixes canonical tags + sitemap).

## Option B — GitHub Pages (recommended: free, versioned, predictable URL)

Your URL will be `https://USERNAME.github.io/REPO/` — so you can set `BASE_URL` first.

1. Set `BASE_URL = 'https://USERNAME.github.io/REPO'` in `build.js`, then run `node build.js`.
2. Create a new GitHub repo (e.g. `financial-calculator`).
3. From this folder:
   ```bash
   cd dist
   git init && git add -A && git commit -m "Deploy financial calculator"
   git branch -M main
   git remote add origin https://github.com/USERNAME/REPO.git
   git push -u origin main
   ```
4. Repo → **Settings → Pages → Build and deployment → Deploy from a branch → main / root → Save.**
5. Wait ~2 minutes → your site is live at `https://USERNAME.github.io/REPO/`.

---

## After it's live — get indexed (do this once)

1. Go to https://search.google.com/search-console → add your URL as a property → verify (HTML tag or DNS).
2. Submit your sitemap: paste `sitemap.xml` under **Sitemaps**.
3. Use **URL Inspection → Request indexing** on your top 3 pages (income-tax, sip, emi).

Without Search Console you wait weeks; with it, days.

## Iterating

- Add a calculator → edit `CALCS` in `index.html`, add its SEO copy to `PAGES` in `build.js`, run `node build.js`, redeploy `dist`.
- Change copy/design → edit `index.html`, rebuild, redeploy.
