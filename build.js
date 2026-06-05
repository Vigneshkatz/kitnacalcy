/* =====================================================================
   build.js — generates SEO landing pages from the single-file app.
   Zero dependencies. Run:  node build.js
   Output: /dist  (index.html + one folder per calculator + sitemap + robots)
   ===================================================================== */
const fs = require('fs');
const path = require('path');

/* 1) EDIT THIS to your real published URL (no trailing slash) */
const BASE_URL = 'https://vigneshkatz.github.io/kitnacalc';

/* Optional analytics — paste your IDs and re-run build to track all 25 pages.
   GA4:     https://analytics.google.com  -> Admin -> Data streams -> Measurement ID (G-XXXXXXXXXX)
   Clarity: https://clarity.microsoft.com -> create project -> copy project ID            */
const GA_ID = '';       // e.g. 'G-XXXXXXXXXX'
const CLARITY_ID = '';  // e.g. 'abcde12345'

/* 2) Per-calculator SEO copy. id must match the app's CALCS keys. */
const PAGES = {
  'income-tax': {
    h1: 'Income Tax Calculator (New vs Old Regime)',
    title: 'Income Tax Calculator FY 2025-26 — New vs Old Regime | India',
    desc: 'Free income tax calculator for FY 2025-26 (AY 2026-27). Compare the new vs old regime, standard deduction, 87A rebate and surcharge instantly.',
    intro: 'Calculate your income tax for FY 2025-26 (AY 2026-27) and instantly see whether the new or old regime saves you more. It includes the ₹4 lakh nil slab, ₹75,000 standard deduction, the ₹60,000 Section 87A rebate (zero tax up to ₹12.75 lakh for salaried taxpayers), surcharge with marginal relief and 4% health & education cess.',
    faqs: [
      ['Up to what salary is there no income tax in FY 2025-26?', 'Under the new regime, salaried individuals pay zero tax on income up to ₹12.75 lakh (₹12 lakh after the ₹75,000 standard deduction) because of the Section 87A rebate.'],
      ['Is the new regime better than the old regime?', 'For most salaried people without large deductions the new regime now wins. The old regime can still be better if your 80C, 80D, home-loan interest and HRA deductions are large.']
    ]
  },
  'gst': {
    h1: 'GST Calculator (CGST, SGST, IGST)',
    title: 'GST Calculator India — Add or Remove GST (5%, 12%, 18%, 28%)',
    desc: 'Free GST calculator: add or remove GST at 5%, 12%, 18% or 28% and split it into CGST, SGST and IGST for intra-state and inter-state supply.',
    intro: 'Add GST to a base price or remove GST from a GST-inclusive amount at any rate — 5%, 12%, 18%, 28% or custom. The calculator splits the tax into CGST and SGST for intra-state sales, or shows IGST for inter-state sales.',
    faqs: [
      ['How do I calculate GST on an amount?', 'To add GST, multiply the base amount by the GST rate. To remove GST from an inclusive price, divide by 1 plus the rate. The difference is the GST amount.'],
      ['What is the difference between CGST, SGST and IGST?', 'For sales within a state the GST is split equally into CGST (central) and SGST (state). For sales between states the whole tax is charged as IGST.']
    ]
  },
  'ctc': {
    h1: 'Salary / In-Hand Calculator',
    title: 'Salary In-Hand Calculator India — CTC to Take-Home Pay',
    desc: 'Convert your annual CTC to monthly in-hand salary. Estimates PF, gratuity, professional tax and income tax under the new regime.',
    intro: 'Enter your annual CTC and see an estimate of your monthly take-home pay after employer PF, gratuity, your own PF, professional tax and income tax under the new regime.',
    faqs: [
      ['Why is my in-hand salary lower than my CTC?', 'CTC includes employer contributions (PF, gratuity) and your deductions (PF, professional tax, income tax) that are removed before you receive your in-hand pay.'],
      ['Is this in-hand calculation exact?', 'It is a close estimate. Your actual take-home depends on your exact salary structure and benefits, so treat it as a guide.']
    ]
  },
  'hra': {
    h1: 'HRA Exemption Calculator',
    title: 'HRA Exemption Calculator India — How Much HRA Is Tax-Free',
    desc: 'Calculate your tax-free House Rent Allowance (HRA) exemption based on basic salary, HRA received, rent paid and metro/non-metro city.',
    intro: 'Find out how much of your House Rent Allowance is exempt from tax. The exemption is the least of actual HRA received, rent paid minus 10% of basic, and 50% (metro) or 40% (non-metro) of basic salary.',
    faqs: [
      ['How is HRA exemption calculated?', 'It is the least of three amounts: actual HRA received, rent paid minus 10% of basic salary, and 50% of basic for metro cities (40% for non-metro).'],
      ['Can I claim HRA in the new tax regime?', 'No, the HRA exemption is available only under the old tax regime.']
    ]
  },
  'gratuity': {
    h1: 'Gratuity Calculator',
    title: 'Gratuity Calculator India — Payout, Formula & Eligibility',
    desc: 'Calculate your gratuity payout using last drawn salary and years of service. Shows the tax-exempt limit of ₹20 lakh.',
    intro: 'Estimate your gratuity using the formula: last drawn salary (basic + DA) × 15 × years of service ÷ 26. The calculator also shows the ₹20 lakh tax-exemption cap.',
    faqs: [
      ['When am I eligible for gratuity?', 'You generally need at least 5 years of continuous service with an employer to be eligible for gratuity.'],
      ['Is gratuity taxable?', 'Gratuity up to ₹20 lakh is tax-exempt for eligible employees; amounts above that are taxable.']
    ]
  },
  'sip': {
    h1: 'SIP Calculator',
    title: 'SIP Calculator — Mutual Fund SIP Returns & Maturity',
    desc: 'Free SIP calculator. Estimate the maturity value and returns of your monthly mutual fund SIP for any amount, rate and period.',
    intro: 'See how your monthly SIP can grow. Enter your monthly investment, expected return and period to get the total invested, estimated returns and final corpus.',
    faqs: [
      ['How is SIP return calculated?', 'Each monthly instalment grows at the expected rate of return, compounded monthly, and all instalments add up to your final corpus.'],
      ['Are SIP returns guaranteed?', 'No. SIP returns depend on market performance; the calculator uses an assumed average return for estimation only.']
    ]
  },
  'lumpsum': {
    h1: 'Lumpsum Investment Calculator',
    title: 'Lumpsum Calculator — One-Time Investment Returns',
    desc: 'Calculate the future value of a one-time lumpsum investment in mutual funds or any asset for a chosen rate and period.',
    intro: 'Estimate how a single one-time investment grows over time. Enter the amount, expected annual return and number of years to see the maturity value and gains.',
    faqs: [
      ['SIP or lumpsum — which is better?', 'Lumpsum can earn more if invested at the right time, while SIP averages out market ups and downs. The best choice depends on your cash flow and risk appetite.'],
      ['How is lumpsum return calculated?', 'The amount compounds annually at the expected rate: future value = amount × (1 + rate)^years.']
    ]
  },
  'stepupsip': {
    h1: 'Step-Up SIP Calculator',
    title: 'Step-Up SIP Calculator — Top-Up SIP Returns',
    desc: 'Calculate returns of a step-up (top-up) SIP that increases every year. See how raising your SIP annually boosts your corpus.',
    intro: 'A step-up SIP increases your monthly investment by a fixed percentage every year. See how much extra corpus this builds compared with a flat SIP.',
    faqs: [
      ['What is a step-up SIP?', 'A SIP where the monthly amount automatically increases each year (for example by 10%), usually in line with your salary growth.'],
      ['Why use a step-up SIP?', 'Increasing your SIP yearly can dramatically grow your final corpus thanks to compounding on larger contributions.']
    ]
  },
  'goalsip': {
    h1: 'Goal SIP Calculator',
    title: 'Goal SIP Calculator — Monthly SIP Needed for a Target',
    desc: 'Find the monthly SIP needed to reach a financial goal. Enter your target amount, expected return and time horizon.',
    intro: 'Working backwards from a goal? Enter your target amount, expected return and time horizon to find the monthly SIP you need to invest to reach it.',
    faqs: [
      ['How much should I invest monthly to reach my goal?', 'The calculator inverts the SIP formula to show exactly the monthly amount required for your target, rate and time.'],
      ['What return should I assume?', 'Equity mutual funds have historically returned around 10-12% over the long term, but use a conservative figure for safety.']
    ]
  },
  'swp': {
    h1: 'SWP Calculator',
    title: 'SWP Calculator — Systematic Withdrawal Plan',
    desc: 'Plan a Systematic Withdrawal Plan (SWP). See how long your corpus lasts with regular monthly withdrawals and growth.',
    intro: 'A SWP lets you withdraw a fixed amount every month from an invested corpus. See your remaining balance over time, or how long the corpus will last.',
    faqs: [
      ['What is an SWP?', 'A Systematic Withdrawal Plan lets you withdraw a fixed sum at regular intervals from a mutual fund corpus while the rest stays invested.'],
      ['Will my SWP corpus run out?', 'If withdrawals exceed returns, the corpus depletes over time. The calculator shows exactly when, based on your inputs.']
    ]
  },
  'fd': {
    h1: 'FD Calculator',
    title: 'FD Calculator — Fixed Deposit Maturity & Interest',
    desc: 'Calculate fixed deposit maturity value and interest for any amount, rate, tenure and compounding frequency.',
    intro: 'Estimate the maturity value of a fixed deposit. Enter the deposit amount, interest rate, tenure and compounding frequency (quarterly is standard for Indian banks).',
    faqs: [
      ['How is FD interest calculated?', 'Most banks compound FD interest quarterly: maturity = principal × (1 + rate/4)^(4 × years).'],
      ['Is FD interest taxable?', 'Yes, FD interest is added to your income and taxed at your slab rate; banks deduct TDS above certain limits.']
    ]
  },
  'rd': {
    h1: 'RD Calculator',
    title: 'RD Calculator — Recurring Deposit Maturity & Interest',
    desc: 'Calculate recurring deposit (RD) maturity value and interest earned for any monthly deposit, rate and tenure.',
    intro: 'See what your recurring deposit will be worth at maturity. Enter the monthly deposit, interest rate and number of months to get total deposited, interest and maturity value.',
    faqs: [
      ['What is a recurring deposit?', 'An RD lets you deposit a fixed amount every month for a set period and earns interest like a fixed deposit.'],
      ['Is RD interest taxable?', 'Yes, RD interest is taxable at your income slab rate and may attract TDS.']
    ]
  },
  'ppf': {
    h1: 'PPF Calculator',
    title: 'PPF Calculator — Public Provident Fund Maturity',
    desc: 'Calculate PPF maturity value and interest over 15 years. Tax-free returns with the current PPF interest rate.',
    intro: 'Estimate your Public Provident Fund corpus. Enter your yearly deposit, the interest rate (currently about 7.1%) and the period to see the tax-free maturity value.',
    faqs: [
      ['What is the PPF lock-in period?', 'PPF has a 15-year lock-in, extendable in blocks of 5 years, with partial withdrawals allowed from the 7th year.'],
      ['Is PPF tax-free?', 'Yes, PPF enjoys EEE status — the deposit, interest and maturity are all exempt from tax.']
    ]
  },
  'compound': {
    h1: 'Compound Interest Calculator',
    title: 'Compound Interest Calculator — Maturity & Interest',
    desc: 'Calculate compound interest and maturity amount for any principal, rate, period and compounding frequency.',
    intro: 'See the power of compounding. Enter the principal, interest rate, period and compounding frequency to get the total interest and maturity amount.',
    faqs: [
      ['What is the compound interest formula?', 'A = P × (1 + r/n)^(n × t), where P is principal, r the rate, n the compounding frequency per year and t the years.'],
      ['How is it different from simple interest?', 'Compound interest earns interest on previously earned interest, so it grows faster than simple interest over time.']
    ]
  },
  'simple': {
    h1: 'Simple Interest Calculator',
    title: 'Simple Interest Calculator — Interest & Total Amount',
    desc: 'Calculate simple interest and total amount for any principal, rate and time period.',
    intro: 'Quickly work out simple interest. Enter the principal, rate and time to get the interest and the total amount payable or receivable.',
    faqs: [
      ['What is the simple interest formula?', 'Simple interest = principal × rate × time ÷ 100. It is calculated only on the original principal.'],
      ['When is simple interest used?', 'It is common for short-term loans, some vehicle loans and informal lending where interest is not compounded.']
    ]
  },
  'emi': {
    h1: 'EMI Calculator',
    title: 'EMI Calculator — Home, Car & Personal Loan EMI',
    desc: 'Calculate your loan EMI, total interest and total payment for home, car or personal loans at any rate and tenure.',
    intro: 'Find your monthly EMI for any loan. Enter the loan amount, interest rate and tenure to see the EMI, total interest payable and total amount.',
    faqs: [
      ['How is EMI calculated?', 'EMI = P × i × (1+i)^n ÷ ((1+i)^n − 1), where P is the loan amount, i the monthly interest rate and n the number of months.'],
      ['How can I reduce my EMI?', 'Choose a longer tenure, make a larger down payment, or negotiate a lower interest rate — though a longer tenure raises total interest.']
    ]
  },
  'prepay': {
    h1: 'Loan Prepayment Calculator',
    title: 'Loan Prepayment Calculator — Interest Saved & Tenure Cut',
    desc: 'See how much interest you save and how many months you shave off your loan by paying a little extra every month.',
    intro: 'Paying extra each month dramatically cuts loan interest. Enter your loan details and a monthly extra payment to see the interest saved and how much earlier your loan closes.',
    faqs: [
      ['Does prepaying a loan save money?', 'Yes. Extra payments go straight to principal, reducing the interest charged over the remaining tenure and closing the loan sooner.'],
      ['Is it better to prepay or invest?', 'If your loan rate is higher than your expected investment return, prepaying usually wins; otherwise investing may be better.']
    ]
  },
  'affordability': {
    h1: 'Loan Eligibility Calculator',
    title: 'Loan Eligibility Calculator — Max Loan from Your EMI',
    desc: 'Find the maximum loan you can take based on the EMI you can comfortably afford, the interest rate and tenure.',
    intro: 'Work out how big a loan you can afford. Enter the EMI you can comfortably pay each month, the interest rate and tenure to see your maximum eligible loan amount.',
    faqs: [
      ['How much loan can I get on my salary?', 'Lenders usually cap your total EMIs at around 40-50% of your monthly income. Enter an affordable EMI to see the loan it supports.'],
      ['What affects loan eligibility?', 'Your income, existing EMIs, credit score, loan tenure and the interest rate all affect how much you can borrow.']
    ]
  },
  'nps': {
    h1: 'NPS Calculator',
    title: 'NPS Calculator — Pension & Corpus at 60',
    desc: 'Calculate your National Pension System (NPS) corpus at 60, the tax-free lump sum and your estimated monthly pension.',
    intro: 'Plan your retirement with NPS. Enter your monthly contribution, age and expected return to see your corpus at 60, the lump sum you can withdraw and your estimated monthly pension.',
    faqs: [
      ['How much pension will I get from NPS?', 'At 60 you must use at least 40% of the corpus to buy an annuity; your pension depends on that annuity amount and the annuity rate.'],
      ['Is the NPS lump sum tax-free?', 'Up to 60% of the corpus can be withdrawn as a lump sum at 60, and that withdrawal is currently tax-free.']
    ]
  },
  'epf': {
    h1: 'EPF Calculator',
    title: 'EPF Calculator — Provident Fund Corpus at Retirement',
    desc: 'Calculate your Employees Provident Fund (EPF) corpus at retirement based on basic salary, contributions and annual hikes.',
    intro: 'Estimate your EPF corpus at retirement. Enter your monthly basic salary, current balance, expected annual hike and the EPF interest rate to see your final fund.',
    faqs: [
      ['How much is contributed to EPF?', 'Employees contribute 12% of basic; the employer adds 12% (about 3.67% to EPF and the rest to the pension scheme).'],
      ['Is EPF taxable?', 'EPF is largely tax-free if you complete 5 years of continuous service; interest above certain contribution limits can be taxable.']
    ]
  },
  'retirement': {
    h1: 'Retirement Corpus Calculator',
    title: 'Retirement Calculator India — How Much You Need to Retire',
    desc: 'Calculate the corpus you need to retire, adjusted for inflation and post-retirement returns, based on your current expenses.',
    intro: 'Find out how much you need to retire comfortably. Enter your current monthly expenses, years to retirement, inflation and expected returns to see the corpus required.',
    faqs: [
      ['How much corpus do I need to retire in India?', 'It depends on your expenses, inflation and how long you expect retirement to last. The calculator estimates it from your real (inflation-adjusted) returns.'],
      ['What is the 4% rule?', 'A guideline suggesting you can withdraw about 4% of your corpus in the first retirement year, then adjust for inflation, with low risk of running out.']
    ]
  },
  'inflation': {
    h1: 'Inflation Calculator',
    title: 'Inflation Calculator — Future Value & Purchasing Power',
    desc: 'See how inflation erodes money over time. Calculate the future cost of an amount and the future worth of money today.',
    intro: 'Understand what inflation does to your money. Enter an amount, the expected inflation rate and number of years to see its future cost and its eroded purchasing power.',
    faqs: [
      ['How does inflation affect my savings?', 'Inflation reduces purchasing power, so the same money buys less over time. Investments need to beat inflation to grow in real terms.'],
      ['What inflation rate should I use?', 'India has historically averaged around 5-6% inflation, but use a figure that fits your spending pattern.']
    ]
  },
  'discount': {
    h1: 'Discount Calculator',
    title: 'Discount Calculator — Sale Price & Savings',
    desc: 'Calculate the final price after a discount and how much you save. Quick and free.',
    intro: 'Work out sale prices in a second. Enter the original price and the discount percentage to see how much you save and the final price you pay.',
    faqs: [
      ['How do I calculate a discount?', 'Multiply the price by the discount percentage to get the saving, then subtract it from the original price for the final price.'],
      ['How do I find the percentage off?', 'Divide the saving by the original price and multiply by 100 to get the discount percentage.']
    ]
  },
  'tip': {
    h1: 'Tip & Split Calculator',
    title: 'Tip Calculator — Tip Amount & Split a Bill',
    desc: 'Calculate the tip and split a restaurant bill between any number of people. Fast and free.',
    intro: 'Split a bill fairly. Enter the bill amount, tip percentage and number of people to see the tip, total and exactly how much each person pays.',
    faqs: [
      ['How much should I tip in India?', 'Tipping is optional; 5-10% of the bill is common at restaurants when a service charge is not already added.'],
      ['How do I split a bill with tip?', 'Add the tip to the bill, then divide the total by the number of people. The calculator does this instantly.']
    ]
  }
};

/* ---------- build ---------- */
const SRC = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const DIST = path.join(__dirname, 'docs'); // GitHub Pages serves from /docs
// Clean dist contents but PRESERVE .git (so re-running build doesn't break a deploy repo)
if (fs.existsSync(DIST)) {
  for (const entry of fs.readdirSync(DIST)) {
    if (entry === '.git') continue;
    fs.rmSync(path.join(DIST, entry), { recursive: true, force: true });
  }
} else {
  fs.mkdirSync(DIST, { recursive: true });
}

function analyticsSnippet() {
  let s = '';
  if (GA_ID) s += `\n<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>`
    + `\n<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');</script>`;
  if (CLARITY_ID) s += `\n<script type="text/javascript">(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y)})(window,document,"clarity","script","${CLARITY_ID}");</script>`;
  return s;
}
function metaTags(canonical, title, desc) {
  return `\n<link rel="canonical" href="${canonical}">`
    + `\n<meta property="og:title" content="${title}">`
    + `\n<meta property="og:description" content="${desc}">`
    + `\n<meta property="og:type" content="website">`
    + `\n<meta property="og:url" content="${canonical}">`
    + `\n<meta name="twitter:card" content="summary">`;
}

function seoSection(p) {
  const faqs = p.faqs.map(([q, a]) => `<dt>${q}</dt><dd>${a}</dd>`).join('');
  return `<section class="seo"><div class="card">`
    + `<h2>${p.h1} — FY 2025-26</h2><p>${p.intro}</p>`
    + `<h3>Frequently asked questions</h3><dl class="faq">${faqs}</dl>`
    + `<p class="muted"><a href="../index.html">← Back to all 24 financial calculators</a></p>`
    + `</div></section>`;
}

function faqLd(p) {
  return `<script type="application/ld+json">` + JSON.stringify({
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: p.faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } }))
  }) + `</script>`;
}

function makePage(id, p) {
  const canonical = `${BASE_URL}/${id}/`;
  let html = SRC;
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${p.title}</title>`);
  html = html.replace(/<meta name="description" content="[\s\S]*?">/, `<meta name="description" content="${p.desc}">`);
  html = html.replace(/(<meta name="theme-color"[^>]*>)/, `$1${metaTags(canonical, p.title, p.desc)}`);
  html = html.replace(/<h1>KitnaCalc<\/h1>/, `<h1>${p.h1}</h1>`);
  html = html.replace(/<body>/, `<body>\n<script>if(!location.hash)history.replaceState(null,'','#/${id}');</script>`);
  html = html.replace(/<section class="seo">[\s\S]*?<\/section>/, seoSection(p));
  html = html.replace(/<script type="application\/ld\+json">\s*\{"@context":"https:\/\/schema.org","@type":"FAQPage"[\s\S]*?<\/script>/, faqLd(p));
  html = html.replace('</head>', analyticsSnippet() + '\n</head>');
  const dir = path.join(DIST, id);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
}

// home page (canonical to root, keep the generic hub SEO section)
let home = SRC.replace(/(<meta name="theme-color"[^>]*>)/,
  `$1\n<link rel="canonical" href="${BASE_URL}/">`
  + `\n<meta property="og:title" content="KitnaCalc — All-in-One Financial Calculator India">`
  + `\n<meta property="og:description" content="24 free Indian financial calculators: income tax, GST, SIP, EMI, FD, RD, PPF, NPS and more.">`
  + `\n<meta property="og:type" content="website">\n<meta property="og:url" content="${BASE_URL}/">`
  + `\n<meta name="twitter:card" content="summary">`);
home = home.replace('</head>', analyticsSnippet() + '\n</head>');
fs.writeFileSync(path.join(DIST, 'index.html'), home);

// per-calculator pages
const ids = Object.keys(PAGES);
ids.forEach(id => makePage(id, PAGES[id]));

// README (copied into dist so the deployed repo shows it; live URL auto-filled)
const readmePath = path.join(__dirname, 'README.md');
if (fs.existsSync(readmePath)) {
  const readme = fs.readFileSync(readmePath, 'utf8').replace(/https:\/\/USERNAME\.github\.io\/kitnacalc\/?/g, BASE_URL + '/');
  fs.writeFileSync(path.join(DIST, 'README.md'), readme);
}

// sitemap + robots
const urls = [`${BASE_URL}/`, ...ids.map(id => `${BASE_URL}/${id}/`)];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`
  + urls.map(u => `  <url><loc>${u}</loc><changefreq>monthly</changefreq></url>`).join('\n') + `\n</urlset>\n`;
fs.writeFileSync(path.join(DIST, 'sitemap.xml'), sitemap);
fs.writeFileSync(path.join(DIST, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${BASE_URL}/sitemap.xml\n`);
// Disable Jekyll — this is a plain static site, serve files as-is
fs.writeFileSync(path.join(DIST, '.nojekyll'), '');

console.log(`✓ Built ${ids.length} calculator pages + home into /docs`);
console.log(`✓ sitemap.xml (${urls.length} URLs) + robots.txt`);
if (BASE_URL.includes('YOUR-SITE')) console.log('⚠ Remember to set BASE_URL at the top of build.js to your real URL, then re-run.');
