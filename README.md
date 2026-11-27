# Biscuit & Bramble — Website Handover

Static website for **Biscuit & Bramble**, an imaginary dog grooming studio
in Bramblewood (14 Acorn Lane). No build step, no backend, no database,
no API keys, no analytics. This is a fictional business created for this
site — the names, town, address, phone, email and reviews are invented.

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

## Business facts on the page (imaginary)
- Bramblewood studio: 14 Acorn Lane, Bramblewood
- Phone (555) 014-8820 · Email hello@biscuitandbramble.com
- Hours: Studio Mon–Sat 8:00 AM–5:00 PM · Mobile 7 days 8:00 AM–5:00 PM
- Founded Mar 2021 in a garden shed by Hazel Quinn; moved to
  14 Acorn Lane in Winter 2022 after a storm damaged the shed roof.
- Services: The Full Bramble, Bath & Tidy, The Quick Wash (inclusions
  as listed on the page) + à la carte items. No prices are shown —
  prices are quoted for each pup's coat and size.
- Mobile grooming requires vaccines up-to-date: DHPP, Bordetella, Rabies.
- Hiring: Dog Groomer and Grooming Assistant. Pay is shared on
  application. Apply by emailing a resume to
  jobs@biscuitandbramble.com, subject "Grooming position application".

## Booking form — read this
- The form validates in the browser, then opens the visitor's email app
  with the request pre-filled and addressed to
  **hello@biscuitandbramble.com**. The visitor presses Send. There is no
  silent online submission and nothing is stored.
- To get silent in-page submissions instead, connect a form service
  (e.g. Formspree / Web3Forms) to the form in `index.html`
  (`id="bookForm"`) and remove the `mailto:` step in `assets/js/spa.js`.

## Notes
- Every photo on the page was AI-generated for this imaginary business;
  see humans.txt. The hero film is a free stock video (Pexels).
- There is no live map: the business is imaginary, so the Booking
  section has a written "Find us" note instead of a map embed.
- `404.html` is the designed not-found page; GitHub Pages and most
  static hosts serve it automatically.
