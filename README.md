# Catch the Beat — local redesign

A responsive 13-page website built with Next.js App Router, React and TypeScript. The live website has not been changed.

## Pages and navigation

The menu follows the supplied structure exactly: Home, About Us, Case Studies, Services (six service pages), News, and Contact (Clubhouse). Services and Contact are clickable overview pages with separate dropdown buttons. Dropdowns open on desktop hover or click and on mobile tap; they support keyboard Enter, Escape, outside-click dismissal and current-page highlighting on every page.

| Page | Local path |
| --- | --- |
| Home | `/` |
| About Us | `/about-us` |
| Case Studies | `/case-studies` |
| Services | `/services` |
| AI for Local Government | `/ai-for-local-government` |
| AI For Records Management | `/records_management` |
| AI in Emergency Management | `/emergency_management` |
| Policy Writing | `/policy_writing` |
| AI Workshop | `/ai_workshop` |
| Fractional / Interim Leadership | `/fractional-interim-leadership` |
| News | `/news` |
| Contact | `/contact` |
| Clubhouse | `/club` |

AI for Local Government uses `/ai-for-local-government`; the legacy `/email-marketing` URL redirects permanently to it. Other existing service slugs are retained. Every page has its own title, description, canonical URL and sharing metadata.

## Preview and setup

Open **http://localhost:3000** while the preview server is running. From `D:\Orca-Projects`, using Node.js 22 or newer:

```powershell
npm.cmd ci
npm.cmd run dev
```

For a production preview, stop the development server first, then:

```powershell
npm.cmd run build
npm.cmd start
```

On macOS/Linux, use `npm` instead of `npm.cmd`. This Windows environment blocks `npm.ps1`, so the commands above explicitly use the executable shim.

## Editing

- `content/site.ts`: navigation, booking URL, email, services, engagement steps and articles.
- `content/service-pages.ts`: the six service pages and their verified source URLs.
- `components/PageIntro.tsx`, `components/ServicePage.tsx`: shared interior-page layouts.
- `components/HomeSections.tsx`: homepage sections, Daphne’s introduction and testimonial.
- `components/Header.tsx`, `components/Footer.tsx`: navigation and branding.
- `components/FlowArt.tsx`: original static SVG gold-line artwork.
- `app/globals.css`: central colour, typography, spacing and radius tokens, and responsive layouts.
- `app/layout.tsx`, `app/opengraph-image.tsx`, `app/icon.svg`: metadata, social image and favicon.
- `public/fonts`: self-hosted Manrope and Allura, with OFL licences. Only `latin-0.woff2` and `latin-1.woff2` are loaded. Manrope is a variable font.
- `public/images`: genuine CTB logo and optimised WebP portrait, lazy-loaded through Next Image.

## Verified sources

Reviewed 23 September 2026:

- [Homepage](https://catchthebeat.ca/): municipal focus, applications, approach and testimonial.
- [About Daphne](https://catchthebeat.ca/about-us/): digital transformation background and experience in Port Edward.
- [Contact](https://catchthebeat.ca/contact/): published Calendly destination and Adam Doolittle’s attribution as Communications Coordinator, District of Tofino. The quote is an exact excerpt; its original spelling is retained.
- [Existing service page](https://catchthebeat.ca/email-marketing/): workshops, implementation, records workflows and continuing support.
- [Copilot article](https://catchthebeat.ca/the-button-is-inside-copilot-your-data-may-not-be/) and [AI procurement article](https://catchthebeat.ca/the-agent-can-find-the-savings-it-cannot-sign-the-contract/): both published 20 September 2026. These link to the real articles rather than reproducing them.
- Business card at `C:/Users/Villacin PC/Desktop/Daphne-Projects/CTB/1790032337783.jpg`: visual identity, email and credentials. The site correctly says **Doctoral Candidate**, not an earned doctorate. Manrope and Allura are visual approximations.
- [Genuine portrait](https://catchthebeat.ca/wp-content/uploads/2026/01/Daphne_Branding_LanzaManagePhoto_KatyTX_5-1024x681.jpg), downloaded for local use.
- Existing local CTB logo `public/images/ctb-logo.png` visually matches the supplied card and appears in the header and footer.

The Case Studies page now links to the published [Chamber of Commerce brief](https://catchthebeat.ca/wp-content/uploads/2023/03/Chamber-Case-Study.pdf) and [Automotive Industry brief](https://catchthebeat.ca/wp-content/uploads/2021/01/CTB-Automotive-Industry-Case-Study.pdf). Both PDFs were downloaded, read and visually checked. The summaries describe historical marketing work and are not presented as municipal AI results. No numerical result claims were added.

Additional service sources reviewed: `/records_management/`, `/emergency_management/`, `/policy_writing/`, `/ai_workshop/`, and `/fractional-cmo/` on the existing site. No clients, results, qualifications or compliance guarantees were invented. Unverified social links, policies and template addresses were omitted.

## Consultation and missing integrations

- All consultation actions use the published booking destination: `https://calendar.app.google/Kdfa15ZfDneaNq2s6`.
- Email actions open the visitor’s email app addressed to `digital@catchthebeat.ca`.
- The contact form sends directly to `digital@catchthebeat.ca` through SMTP. Configure the server email settings in `.env.example`; see [contact email setup](docs/contact-email.md). WordPress is not used for form delivery.
- No required visual asset is missing. A vector master logo would be useful for future larger applications; the current raster is sufficient at its displayed size.
- No chatbot, AI API, analytics, advertising cookies or new third-party embed was added.
- Booking and articles are external services. HTTP availability is checked; no appointment or email was submitted.
- The existing `/club` link returned 404. The new Clubhouse page provides a working email enquiry action. Its intended community/profile content and destination are awaiting the user’s clarification; no membership programme or social-profile URL has been invented.

## URL preservation and future launch

Implemented permanent (308) redirects:

| Incoming path | Destination |
| --- | --- |
| `/about` | `/about-us` |
| `/training` | `/ai_workshop` |
| `/resources`, `/insights` | `/news` |
| `/clubhouse` | `/club` |

Next.js handles trailing-slash normalization. The former homepage-anchor redirects have been removed so the dedicated pages load directly.

**Before a future launch:** retain WordPress article URLs, media and archives via hosting/proxy routing, or migrate the content while preserving exact slugs. This preview does not import the blog. Audit `/case-studies/` and individual marketing case-study URLs before deciding what to retain; no blanket redirect discards their content. Canonical and sharing URLs use `https://catchthebeat.ca`. Launch and domain changes are a separate deployment task.

## Verification

With the preview running and Google Chrome installed:

```powershell
npm.cmd run check
npm.cmd run check:a11y
```

The accessibility script uses saved axe-core 4.10.3 in `artifacts/axe.min.js`, which never ships to visitors.

Checks cover all 13 pages at 320, 375, 768, 1024 and 1440px; overflow; desktop/mobile dropdowns; parent and child navigation; Escape focus restoration; skip navigation; consultation destinations; redirects; canonical URLs; reduced motion; and 200% text enlargement on each page at 375px.

Updated screenshots: `artifacts/pages/`. Combined verification record: `artifacts/verification.txt`. Final focused interaction and text-zoom run: `artifacts/interaction-verification.txt` (repeat with `npm.cmd run check -- --interactions-only`). Automated WCAG 2.2 AA-tagged checks and 44px target-size checks for all pages at 375 and 1440px: `artifacts/accessibility.json`. Earlier homepage-only screenshots remain in `artifacts/` for reference. External HTTP checks: `artifacts/external-links.json`.

Automated checks supplement visual and keyboard review; they are not full accessibility certification. The production build also performs TypeScript checking. Real appointments, email delivery, Safari/Firefox and physical devices were not tested.
