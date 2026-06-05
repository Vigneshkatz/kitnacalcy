# KitnaCalc 🧮

**India's all-in-one financial calculator.** *Kitna tax? Kitna EMI? Kitna SIP?* — one place for every money calculation.

🔗 **Live:** https://USERNAME.github.io/kitnacalc/

24 fast, free calculators for India. No sign-up, no login, works offline — and **no data ever leaves your device** (everything runs in your browser).

## Calculators

| Category | Tools |
|---|---|
| **Tax & Salary** | Income Tax (new vs old regime, FY 2025-26), GST (CGST/SGST/IGST), Salary in-hand (CTC), HRA exemption, Gratuity |
| **Investments** | SIP, Lumpsum, Step-up SIP, Goal SIP, SWP, FD, RD, PPF, Compound & Simple interest |
| **Loans** | EMI, Prepayment savings, Loan eligibility |
| **Retirement** | NPS, EPF, Retirement corpus |
| **Everyday** | Inflation, Discount, Tip & split |

## Highlights

- ✅ **Accurate FY 2025-26 tax** — ₹4L nil slab, ₹75k standard deduction, ₹60k 87A rebate (zero tax up to ₹12.75L), marginal relief, surcharge & cess.
- ⚡ **Single-file, vanilla JS** — zero dependencies, no framework, no tracking by default.
- 🔎 **SEO-ready** — `build.js` generates a unique landing page per calculator + `sitemap.xml` + structured data.

## Build & deploy

```bash
node build.js     # generates /dist (home + 24 SEO pages + sitemap + robots)
```

Deploy the `dist/` folder to GitHub Pages or Netlify — full steps in [DEPLOY.md](DEPLOY.md).

## Disclaimer

Estimates only — **not financial or tax advice.** Tax figures follow FY 2025-26 (AY 2026-27) rules; always verify on the official Income Tax e-filing portal or with a CA before filing.

## License

MIT — free to use and modify.
