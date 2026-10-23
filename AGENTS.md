# Mycelium project guidance

## Frontend

- The frontend is `frontend/`, built with Next.js App Router, React 19 and Tailwind CSS v4. Keep existing store and auth routes working.
- Tailwind is configured through `frontend/src/styles.css` and `frontend/postcss.config.mjs`; `frontend/components.json` configures shadcn/ui.
- Use shadcn/ui components from `frontend/src/components/ui` for new controls. Add components with `npx shadcn@latest add <component>` from `frontend/`, then adapt their tokens to the Mycelium theme.
- Use `lucide-react` for interface icons, including icons inside shadcn/ui components. Give icon-only controls accessible labels; mark decorative icons `aria-hidden`.
- Preserve the Mycelium visual language: dark purple, light lilac, generous spacing and rounded controls. Avoid introducing unrelated default colors.
- Check changes with `npm run build` in `frontend/`.

## Backend

- The backend is the Kotlin/Spring monolith in `backend-monolito/`. Its auth routes are under `/api/v1/auth`.
- Account emails follow the user's saved `pt`, `en` or `es` locale. Keep auth secrets and SMTP credentials server-side.
