# Mycelium frontend

The storefront now runs on Next.js App Router. The previous React/Vite pages live in
`src/legacy-pages` and are exposed through explicit Next routes under `src/app/(store)`.
The authentication pages are native Next routes under `src/app`.
Tailwind CSS v4 is configured in `src/styles.css` and `postcss.config.mjs`.
`components.json` configures shadcn/ui; add more components with
`npx shadcn@latest add <component>`. Interface icons use `lucide-react`.

## Local setup

1. Use Node 22 and run `npm ci`.
2. Copy `.env.example` to `.env.local` and set `MYCELIUM_BACKEND_URL` to the Java backend URL.
3. Run `npm run dev` and open `http://localhost:3000`.

The Next server rewrites `/api/v1/*` to the Java backend, so the browser uses one origin
for authentication cookies and commerce requests. In production, set
`MYCELIUM_BACKEND_URL` to the internal backend URL. Set
`NEXT_PUBLIC_GOOGLE_CLIENT_ID` to the OAuth Web client ID and use the same ID in
`GOOGLE_CLIENT_ID` on the backend. Configure the frontend origin in Google Cloud.
The Next config accepts the existing `VITE_*` storefront values as fallbacks during
migration, including the Efí payee code and sandbox flag. New deployments should use
the `NEXT_PUBLIC_*` names from `.env.example`.

The locale selector supports Brazilian Portuguese, English and Spanish on the
home, contact and authentication screens. Registration stores the selected locale
in the Java account, and authentication emails use that locale. Existing checkout
screens still contain legacy Portuguese copy and product data.

## Commands

- `npm run dev`: start Next in development
- `npm run build`: type-check and build production assets
- `npm start`: start the production build
