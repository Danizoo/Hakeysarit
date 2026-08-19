# הקיסרית — Hakeysarit

A Caesar-salad rating site and personal blog, in Hebrew (RTL).

```
Main/
├── web/      Astro site — what visitors see. Deploys to Vercel.
└── studio/   Sanity Studio — the admin panel. Deploys to sanity.studio.
```

The site reads its content from Sanity at **build time** and ships plain static
HTML. Nothing is fetched in the browser except map tiles, so pages are fast and
there is no server to keep alive.

Until `SANITY_PROJECT_ID` is set, the site renders the sample content in
`web/src/lib/sample.ts` and shows a "תצוגת דוגמה" strip at the top, so it always
builds and always looks right.

---

## Setup, once

### 1. Create the Sanity project

```bash
cd studio
npx sanity login
npx sanity init --env
```

Choose **"Create new project"**, name it `hakeysarit`, dataset `production`,
and answer **no** when it offers to add a schema — this repo already has one.
`--env` writes `.env` with the project id.

Copy the project id it prints. Then:

```bash
cp ../web/.env.example ../web/.env
```

and put the same id in `web/.env` as `SANITY_PROJECT_ID`.

### 2. Run both locally

```bash
npm run dev --prefix web
```

```bash
npm run dev --prefix studio
```

The site is at `http://localhost:4321`, the admin panel at `http://localhost:3333`.

### 3. Put the admin panel online

```bash
cd studio
npx sanity deploy
```

Pick the hostname `hakeysarit` and it lands at **https://hakeysarit.sanity.studio** —
that is the address your mom bookmarks. Then invite her:
[manage.sanity.io](https://manage.sanity.io) → the project → **Members** → **Invite**.
Give her the **Editor** role. The free plan includes 20 members.

### 4. Deploy the site to Vercel

Push this folder to GitHub, then on [vercel.com](https://vercel.com) → **Add New Project**:

| Setting | Value |
| --- | --- |
| Root Directory | `web` |
| Framework Preset | Astro (auto-detected) |
| Build Command | `npm run build` (default) |
| Output Directory | `dist` (default) |

Add these environment variables:

| Name | Value |
| --- | --- |
| `SANITY_PROJECT_ID` | your project id |
| `SANITY_DATASET` | `production` |
| `SITE_URL` | `https://hakeysarit.vercel.app` (or the real domain later) |
| `SANITY_WRITE_TOKEN` | optional, see below |

### 5. Rebuild automatically when she publishes

The site is static, so it needs a rebuild to pick up new content. Wire that up once:

1. **Vercel** → project → Settings → Git → **Deploy Hooks** → create one named
   `sanity` on branch `main`. Copy the URL.
2. **[manage.sanity.io](https://manage.sanity.io)** → project → API → **Webhooks** →
   **Create webhook**:
   - URL: the deploy hook URL from step 1
   - Dataset: `production`
   - Trigger on: Create, Update, Delete
   - Filter: `_type in ["salad", "post", "settings"]`
   - HTTP method: `POST`

Now hitting **Publish** in the Studio rebuilds the site. It takes about a minute.

---

## How restaurants get onto the map

She never types coordinates. At build time, `web/src/lib/geo.ts` works them out:

1. Coordinates already saved on the document → done.
2. Parsed out of a pasted Google Maps link (`mapsUrl`).
3. Same, after following a `maps.app.goo.gl` short link.
4. Geocoded from the address via OpenStreetMap Nominatim.

If you set **`SANITY_WRITE_TOKEN`**, whatever it works out is written back to the
document, so each restaurant costs one lookup ever and later builds stay fast.
Create the token at manage.sanity.io → API → Tokens, with **Editor** permission.

Without a token everything still works — it just re-resolves on each build, capped
at 25 lookups per build.

A salad with no resolvable location simply doesn't get a pin; the page notes how
many are missing. She can always fix one by hand: the **מיקום מדויק** field.

---

## Editing the design

- Colours, fonts and shared component classes: `web/src/styles/global.css`
- Score wording and colour bands (`יצירת מופת`, `מצוין`, …): `web/src/lib/format.ts`
- Page structure: `web/src/pages/`
- The wreath logo: `web/src/components/Wreath.astro` (and `web/public/favicon.svg`,
  which is generated from the same geometry)

Adding a field for her to fill in means two edits: the schema in
`studio/schemaTypes/`, and the GROQ query plus mapping in `web/src/lib/content.ts`.

---

## Commands

| | |
| --- | --- |
| `npm run dev --prefix web` | site, with hot reload |
| `npm run build --prefix web` | production build into `web/dist` |
| `npm run preview --prefix web` | serve the built site |
| `npm run dev --prefix studio` | admin panel locally |
| `npm run deploy --prefix studio` | publish the admin panel |

See [GUIDE-HE.md](GUIDE-HE.md) for the Hebrew walkthrough written for her.
