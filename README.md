# Water House — React + Backend + CMS-ready Website

A full-stack Water House website built around the supplied brand direction: **MODERN HYDRATION RITUAL.**

## Stack
- React 18 + Vite
- React Router
- Node.js + Express
- MongoDB + Mongoose
- JWT admin authentication
- Built-in content studio
- CMS provider abstraction for future headless CMS migration

## Brand implementation
The public UI follows the Water House brand draft rather than the external moodboard brands:
- Cherry / peach / coco / matcha / leaf palette
- Editorial display typography + clean system body copy
- Modern, natural, refreshing, social visual direction
- Three-step ritual: choose water → add flavour → add function
- Water bases: still, sparkling, coconut
- Brand flavour set and functional boosts seeded into MongoDB
- Water House imagery extracted from the supplied brand presentation is included under `client/public/brand`

## Run locally
```bash
npm install
npm run install:all
cp server/.env.example server/.env
cp client/.env.example client/.env
npm --prefix server run seed
npm run dev
```

Frontend: `http://localhost:5173`
API: `http://localhost:5000/api`
CMS login: `http://localhost:5173/admin`

Change the default admin password in `server/.env` before seeding a real environment.

## CMS compatibility
The React client never talks directly to MongoDB or a CMS vendor. It talks to the Water House API. The server's `src/services/cms.js` normalizes content.

### Internal CMS
```env
CMS_PROVIDER=internal
```
Uses `Page`, `MenuItem`, `ContentCollection` and `SiteSetting` MongoDB collections.

### External/headless CMS
```env
CMS_PROVIDER=headless
CMS_API_URL=https://your-content-api.example.com
CMS_API_TOKEN=optional-token
```
The normalized headless endpoint contract is:
- `GET /pages/:slug`
- `GET /menu`
- `GET /collections/:type`

For Strapi, Sanity, Contentful, Directus or Payload, add a provider adapter in `server/src/services/cms.js` and return the same normalized objects. The React application remains unchanged.

## Public API
- `GET /api/content/pages/:slug`
- `GET /api/content/menu`
- `GET /api/content/collections/:type`
- `POST /api/contact`

## Admin API
Protected by JWT:
- CRUD menu/flavours
- CRUD content collections (functions, bases, etc.)
- Page updates
- Site settings

## Suggested production next steps
- Cloud media storage (Cloudinary/S3)
- Rich-text/page block editor
- Draft/publish workflow
- SEO + Open Graph admin fields
- Arabic/RTL fields
- Locations/opening hours
- Newsletter/CRM integration
- Analytics events
- Rate limiting, validation and password reset
