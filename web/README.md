# Drivebridge Web Application

The Drivebridge web application is built with Next.js 16, React 19, TypeScript, Tailwind CSS 4, shadcn/ui, and Redux Toolkit.

## Responsibilities

- Public landing page and product information.
- Google sign-in entry point and post-login welcome flow.
- Authenticated Drive/MCP dashboard and account settings.
- MCP connection guidance and authorization consent UI.
- API requests proxied through Next.js rewrites to the backend.

## Local development

Configure `web/.env.local` using the root [README](../README.md#environment-configuration), then run:

```bash
pnpm install
pnpm run dev
```

Open `http://localhost:3000`.

## Scripts

```bash
pnpm run dev       # Development server
pnpm run build     # Production build
pnpm run start     # Serve production build
pnpm run lint      # ESLint
pnpm run typecheck # TypeScript checks
```

## Main routes

| Route | Purpose |
| --- | --- |
| `/` | Landing page |
| `/login` | Google sign-in |
| `/auth/welcome` | Post-login welcome |
| `/dashboard` | Main account dashboard |
| `/account` | Account settings |
| `/mcp/connect` | MCP setup instructions |
| `/mcp/consent` | OAuth consent flow |

See the repository root documentation for backend configuration, OAuth setup, architecture, and MCP tool details.
