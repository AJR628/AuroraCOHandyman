# Aurora CO Handyman

Static website for AuroraCOHandyman.com. Local Aurora, Colorado handyman services.

## Stack

- Static HTML, CSS, vanilla JS (no framework)
- Deployed on Netlify
- Forms via Netlify Forms

## Structure

- `index.html` — Homepage
- `about/` — About page
- `services/` — Services hub
- `service-area/` — Aurora neighborhoods served
- `contact/` — Contact form
- `thank-you/` — Form submission landing page
- `drywall-repair/`, `ceiling-repair/`, `deck-repair/`, `fence-repair/`, `interior-painting/`, `gutter-cleaning/`, `door-repair/` — Service detail pages
- `assets/css/styles.css` — Shared design system
- `assets/img/` — Site imagery
- `robots.txt`, `sitemap.xml`, `netlify.toml` — Config

## Deployment

Pushes to `main` auto-deploy via Netlify.

## Analytics and lead measurement

The site uses GA4 property `G-3KVSY13L0X`. Shared event logic lives in `assets/js/analytics-v1.js`.

Tracked events:

- `quote_cta_click` — link to the quote form
- `service_detail_click` — service-page navigation
- `email_click` — direct email action
- `estimate_form_start` — first form interaction
- `estimate_form_submit` — native Netlify form submission
- `estimate_form_success` — confirmed redirect from a submitted form to `/thank-you/`

No names, phone numbers, email addresses, neighborhood text, or project messages are sent to Analytics. Only `estimate_form_success` should be configured as a GA4 key event.
