# Bamburi Beach Resort website — first frontend stage

## Files
- `index.html` — public resort portfolio and quotation form
- `styles.css` — responsive coastal design
- `app.js` — 2026/2027 tariff calculator and quotation preview
- `assets/` — add the resort's own photographs and logo here

## Add to GitHub
1. Create a new repository, for example `bamburi-beach-resort`.
2. Upload `index.html`, `styles.css`, and `app.js` to the repository root.
3. Upload your own image files into `assets/` as you prepare them.
4. In GitHub, open Settings → Pages.
5. Select Deploy from a branch, choose `main` and `/ (root)`, then Save.

## Important current-stage limitations
- This is the public frontend prototype. It does not check live room availability, allocate rooms, or confirm reservations.
- The quotation preview is generated in the visitor's browser. The secure invoice-numbering, permanent online invoice link, PDF storage and server-side tariff validation will be added in the Cloudflare Worker + D1 + R2 stage.
- The WhatsApp action currently shares the quotation details as message text. Once the backend is connected, it will also include the permanent invoice link and PDF-sharing flow.
- Child pricing is intentionally not guessed in the calculator. If children are entered, the visitor is asked to contact reservations until the child-rate and room-sharing rules are fully specified.
- The tariff covers 20 November 2026 through 19 November 2027. Dates outside that period require a new tariff.
- Replace the temporary stock-photo URLs in `styles.css` with the resort's approved photographs before public launch.
- The exact resort room names in the calculator follow the supplied tariff: Superior Ocean View Room; Ocean View With Plunge Pool; Ocean Front Suite; Ocean Breeze Suite.
