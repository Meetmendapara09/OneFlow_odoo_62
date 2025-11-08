## OneFlow Portal Frontend

Next.js + TailwindCSS + DaisyUI interface for OneFlow operations portal. Provides landing page and auth flow (sign in, sign up, forgot password) plus placeholders for projects, tasks, analytics, and profile.

### Tech Stack
- Next.js App Router
- TailwindCSS v4
- DaisyUI (theme: corporate)
- TypeScript

### Development
```bash
npm install
npm run dev
```
Visit http://localhost:3000

### Production Build
```bash
npm run build
npm start
```

### Structure
```
app/
	page.tsx          # Landing page
	signin/           # Sign in
	signup/           # Sign up
	forgot/           # Forgot password
	projects/         # Projects placeholder
	tasks/            # Tasks placeholder
	analytics/        # Analytics placeholder
	profile/          # Profile placeholder
components/         # Shared UI components
tailwind.config.ts  # Tailwind + DaisyUI setup
```

### DaisyUI Theming
Change theme by editing `data-theme` attribute on `<html>` in `app/layout.tsx`.
Available: `corporate`, `light`, `dark`. Add more in `tailwind.config.ts`.

### Backend Integration
Auth forms currently simulate requests. Replace delay blocks in submit handlers with real `fetch` calls to your Spring Boot endpoints (e.g. `POST /auth/login`).

### License
Internal use.
