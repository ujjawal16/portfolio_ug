# Ujjawal Golani — Portfolio (navy · cream · coral)

A fast, dependency-free portfolio site: plain HTML, CSS and JavaScript. No build step.

```
index.html              the page
style.css        all styles (desktop, tablet ≤1024px, phone ≤720px)
main.js          interactions + case study content + fit-checker skills
Ujjawal_Golani_Resume.pdf
favicon.svg
.nojekyll               tells GitHub Pages to serve files as-is
```

## Run it locally

Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000   # then visit http://localhost:8000
```

## Things to edit

| What | Where |
|---|---|
| GitHub profile link (hidden until set) | `GITHUB_URL` at the top of `main.js` |
| Contact email | `EMAIL` in `main.js` and the `mailto:` links in `index.html` |
| Case study text | `CASES` in `main.js` |
| Fit-checker skills and proof lines | `SKILLS` in `main.js` |
| Resume | replace `Ujjawal_Golani_Resume.pdf` (keep the file name) |

## Publish on GitHub Pages

1. Push this folder to a GitHub repository (files at the repo root).
2. On GitHub: **Settings → Pages → Build and deployment → Source: Deploy from a branch**, branch `main`, folder `/ (root)`.
3. The site goes live at `https://<username>.github.io/<repo>/` within a minute or two.
   - For the shorter `https://<username>.github.io/`, name the repo `<username>.github.io`.

## Hand over to Ujjawal

On the repo: **Settings → General → Danger Zone → Transfer ownership**, enter his GitHub username.
After the transfer he re-enables Pages in his account (step 2 above). Links in the site are relative, so nothing else changes.

## Notes

- Motion respects the visitor's "reduce motion" setting.
- The "Does he fit your role?" button bounces until it has been opened once (remembered in the browser).

## SEO checklist (after the site is live)

1. **Set your real address.** Find-and-replace `https://YOUR-USERNAME.github.io/YOUR-REPO/` with your live address in:
   `index.html`, `sitemap.xml`, `robots.txt`.
   This fixes link previews (LinkedIn, WhatsApp, X), the sitemap and the structured data.
2. **Google Search Console** (search.google.com/search-console): add the site as a *URL prefix* property,
   verify it, then submit `sitemap.xml` under *Sitemaps* and use *URL inspection → Request indexing* for the home page.
3. **Link to it** from LinkedIn (Contact info → Website) and the GitHub profile. Inbound links help it get found.

What's already built in: page title, description and keywords; Open Graph + Twitter share cards with
`og-image.png`; Person structured data (JSON-LD); one H1; full case-study text in the HTML
(readable without JavaScript); `robots.txt` allowing everything; `sitemap.xml`.

## "Does he fit your role?" panel

- Recruiters paste a job description, upload it as a PDF or .txt, or tap requirements.
- Matching is keyword-based against the resume and runs entirely in the browser (nothing is uploaded).
  Each requirement is shown as **on his resume** (with proof), **related experience**, or **not on his resume**.
  Edit the skills, keywords and proof lines in `SKILLS` in `main.js`.
- PDF reading uses pdf.js (Apache-2.0), hosted in ``. It only loads when a PDF is uploaded.
  PDF upload works on the live site or a local server (`python3 -m http.server`), not when `index.html`
  is opened by double-clicking; pasting works everywhere.
- "Email Ujjawal" opens a pre-filled email from the recruiter (their name, company and role title are optional fields),
  with "Copy email" and "Open in Gmail" alternatives.
