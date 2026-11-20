# CityPaws Grooming — Website Handover

Static website for CityPaws Grooming, 1219 S Shepherd Dr, Houston, TX 77019.
No build step, no backend, no database, no API keys, no analytics.
Transfer-only: this repo is handed to the client as-is; we do not deploy
it on client hosting.

## Run / deploy
- Open `index.html`, or serve the folder with any static host
  (GitHub Pages, Netlify, Cloudflare Pages, etc.).
- Deploy = publish this whole folder as-is. Nothing to compile.
- All paths are relative, so moving from a subpath to a custom domain
  root needs no code changes.

## Where things live
- All page text, hours, services: `index.html`
- Design (colours, layout): `assets/css/spa.css`
- Behaviour (animations, Reveal drag, booking form): `assets/js/spa.js`
- Photos: `assets/img/` — credits in `humans.txt`
- Type: Marcellus + Manrope, loaded from Google Fonts in `index.html`

## Business facts on the page (verified 2026-11-20)
- River Oaks salon: 1219 S Shepherd Dr, Houston, TX 77019
- Phone (713) 438-2844 · Email management@citypawshtx.com
- Hours: Salon Mon–Sat 8:00 AM–5:00 PM · Mobile 7 days 8:00 AM–5:00 PM
- Founded Aug 2019 in Rice Village by Danni Betancourt; moved to
  River Oaks in Feb 2021 after the freeze/leak ceiling collapse.
- Services: Full Groom, Bath & Sani, Express Bath (inclusions exactly
  as published on citypawshtx.com) + à la carte items. CityPaws
  publishes no prices, so the site shows none.
- Mobile grooming requires vaccines up-to-date: DHPP, Bordetella, Rabies.
- Hiring: Dog Groomer and Grooming Assistant, listed at $15–$20/hr
  (employer-provided, per Glassdoor). Apply by emailing a resume to
  management@citypawshtx.com, subject "Grooming position application".

## Booking form — read this
- The form validates in the browser, then opens the visitor's email app
  with the request pre-filled and addressed to
  **management@citypawshtx.com**. The visitor presses Send. There is no
  silent online submission and nothing is stored.
- To get silent in-page submissions instead, connect a form service
  (e.g. Formspree / Web3Forms) to the form in `index.html`
  (`id="bookForm"`) and remove the `mailto:` step in `assets/js/spa.js`.

## Notes
- The Reveal (before/after) is a real CityPaws transformation — the same
  cream poodle from CityPaws' own Instagram (@CityPaws_Grooming). Every
  photo on the page is CityPaws' own (their website + Instagram); see
  humans.txt and theme-data/CITYPAWS-INSTAGRAM.md.
- The map in the Booking section is a public Google Maps embed of the
  salon's address. No API key.
- `404.html` is the designed not-found page; GitHub Pages and most
  static hosts serve it automatically.

## Transfer checklist
- [ ] Repo transferred to / shared with the client's GitHub account
- [ ] Client told: form works by email (see above), no analytics installed
- [ ] Client has this guide
