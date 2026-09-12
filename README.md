# VANTA — Resonance Help Portal

A cinematic, high-end superhero help portal built for the TechAscent machine test.

The experience is intentionally designed as a digital character rather than a normal landing page:
- Scrollytelling sections
- GSAP scroll-triggered reveals
- Lenis smooth scrolling
- Faux-3D character composition
- Animated SVG logo
- Ambient motion and responsive HUD
- Interactive signal network
- Full-screen conversational help flow
- Automatic email notification through Resend
- Responsive mobile layout
- Reduced-motion accessibility fallback

## 1. Requirements

Install:
- Node.js 20+ recommended
- npm

## 2. Install

```bash
npm install
```

## 3. Configure email

Copy `.env.example` to `.env.local`.

```bash
cp .env.example .env.local
```

Add:

```env
RESEND_API_KEY=re_xxxxxxxxx
HERO_NOTIFICATION_EMAIL=your-email@example.com
RESEND_FROM="Vanta Signal Desk <onboarding@resend.dev>"
```

For production, use a sender domain you have verified in Resend instead of the onboarding sender.

The API route is `/app/api/help/route.ts`.

## 4. Run

```bash
npm run dev
```

Open:

http://localhost:3000

Test the entire flow:
1. Click ASK FOR HELP.
2. Answer name.
3. Answer age.
4. Answer location.
5. Answer email.
6. Describe the request.
7. Confirm that the notification arrives at HERO_NOTIFICATION_EMAIL.

## 5. Production build

```bash
npm run build
npm start
```

## 6. Deploy to Vercel

Recommended flow:

```bash
git init
git add .
git commit -m "Build Vanta resonance portal"
```

Create a GitHub repository and push the project.

Then:
1. Open Vercel.
2. Import the GitHub repository.
3. Vercel detects Next.js automatically.
4. Add the same environment variables in Project Settings -> Environment Variables:
   - RESEND_API_KEY
   - HERO_NOTIFICATION_EMAIL
   - RESEND_FROM
5. Deploy.
6. Open the production URL and test the complete signal flow.

## 7. Production email domain

For a client-facing project, verify the client's domain in Resend and use a sender such as:

```env
RESEND_FROM="Vanta Signal Desk <signal@clientdomain.com>"
```

Do not expose `RESEND_API_KEY` to the browser. It stays server-side in `/app/api/help/route.ts`.

## 8. What to customize before submitting

Replace the fictional branding with your own student identity where required:
- GitHub repository
- Vercel project name
- metadataBase in `app/layout.tsx`
- email recipient
- verified sending domain
- hero copy if desired

The brief asks for an original superhero, so Vanta is intentionally an original concept rather than an existing character.

## 9. Suggested next-level upgrades

For a premium client presentation:
- Replace the CSS faux-3D character with a custom 3D GLB model in React Three Fiber.
- Add Supabase persistence for help requests.
- Add rate limiting / CAPTCHA to the email endpoint.
- Add a real-time anonymous signal map with Supabase Realtime.
- Add a custom domain.
- Add OG/social preview artwork.
- Add analytics only after the client approves privacy requirements.
