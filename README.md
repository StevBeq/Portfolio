# StevBeq — Portfolio

Personal portfolio of **Steven Arnaldo Setiawan (`@StevBeq`)**, Fullstack Web & Mobile Developer based in Yogyakarta, Indonesia.

Built with a dual-layer architecture combining a 60fps scroll-driven showcase (**Layer 1**) and a zero-scroll interactive dashboard (**Layer 2**).

## Tech Stack

- **Framework:** Next.js 15 (App Router) & React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Motion & Smooth Scroll:** GSAP (`ScrollTrigger`, `Flip`, `CustomEase`) + Lenis
- **Icons:** Lucide React & custom SVG brand marks

## Highlights

- **Layer 1 — Scroll Showcase:** Split-shutter opening, interactive 3D orbital meteor cosmos (`HeroInkExplosionCanvas`), POV zoom into core tech stack, full-viewport interactive ASCII-to-photo portrait (`AsciiParticlePortrait`), pinned project showcase (`PinnedProjectShowcase`), and pull-to-explore cartoon portal transition.
- **Layer 2 — Interactive Light Hub:** Single-viewport desktop dashboard (`Overview`, `Projects`, `History`, `Stack`) with instant tab switching, detail showcase modal, and direct contact actions, while unmounting Layer 1 completely for zero background CPU usage.

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Production Build & Deployment

```bash
npm run build
npm run start
```

Ready for zero-config deployment on [Vercel](https://vercel.com) (Framework Preset: **Next.js**).

## Contact

- **GitHub:** [github.com/StevBeq](https://github.com/StevBeq)
- **Email:** stevenarnald@gmail.com
