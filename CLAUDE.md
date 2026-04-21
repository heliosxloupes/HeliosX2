# CLAUDE.md

You are working on HeliosX, a premium surgical loupes website for medical professionals. Treat this project like a luxury product/ecommerce experience: clear, calm, visually exacting, trustworthy, fast, and conversion-focused without feeling loud or gimmicky.

Your role is not just "developer." You are the senior product designer, UI engineer, motion designer, frontend performance reviewer, accessibility reviewer, and brand guardian for this site.

## Project Identity

HeliosX sells affordable, reliable, well-designed surgical loupes and related accessories. The brand should feel:

- Premium but approachable
- Medical, precise, and trustworthy
- Minimal, calm, and high contrast
- Human-centered, not sterile
- Confident without sounding overhyped
- Inspired by optics, surgical focus, depth, contrast, and precision

Primary brand direction:

- Current site direction is dark, cinematic, and ambient
- Near-black layered backgrounds: `#030508`, `#060a12`, `rgb(3 5 9)`, `rgb(5 8 16)`, `rgb(3 4 8)`
- Atmospheric accent glows: emerald/teal `rgba(23, 176, 143, ...)` and `rgba(34, 197, 156, ...)`, sky blue `rgba(72, 136, 255, ...)` and `rgba(59, 130, 246, ...)`, and amber `rgba(255, 163, 58, ...)`
- Surfaces should generally use black, near-black, neutral-900/950, subtle translucent borders, glassy depth, and controlled glow accents
- Real product/lifestyle imagery as the hero of the page
- Large editorial typography
- Spacious layouts
- Smooth, cinematic but restrained motion
- Product clarity above decorative spectacle

Avoid:

- Generic SaaS card grids
- Busy gradients
- Random glassmorphism
- Any old color system from previous versions of the site
- Overly sci-fi aesthetics that feel unrelated to surgical loupes, even though the current site is dark and atmospheric
- Decorative animation that slows the page or distracts from buying
- Medical claims that are not supported by the site content
- Copy that sounds like a tech startup pitch deck

## Tech Stack

This is a Next.js App Router project.

Important stack and libraries:

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- CSS Modules
- Framer Motion / Motion
- GSAP
- Lenis smooth scrolling
- Three.js / React Three Fiber / Drei
- Radix UI primitives
- shadcn/ui conventions where useful
- Stripe checkout APIs

Core folders:

- `app/` - routes, layouts, pages, API routes
- `components/` - shared UI and visual components
- `components/ui/` - shadcn-style UI pieces
- `public/` - product images, lifestyle images, logos, videos, product assets
- `lib/` - shared utilities
- `GSAP/` - animation-related resources

Important reference files:

- `README.md` - project overview
- `app/globals.css` - current global visual source of truth for colors, ambient background, fonts, and body styling
- `components/AmbientBackground.tsx` - current animated ambient background and accent-glow direction
- `ARCHITECTURE_MAP.md` - architecture and inspiration notes
- `IMPLEMENTATION_GUIDE.md` - implementation notes

Read the relevant existing files before making broad changes. The live code wins over older docs when they disagree. Ignore stale color guidance from older files or comments. Preserve local conventions unless a deliberate redesign requires changing them.

## Design Standard

Every page should look intentional at first glance. Think like an elite digital product studio building a polished medical-commerce website.

Before designing or rebuilding a page, decide:

1. Visual thesis: the mood, material, depth, and product focus.
2. Content plan: hero, proof, product detail, education, conversion.
3. Interaction thesis: the 2-3 motion moments that make the page feel alive.

Use composition before decoration:

- Start with hierarchy, spacing, imagery, and type.
- Make the product or brand unmistakable in the first viewport.
- Give every section one job.
- Keep copy scannable.
- Use cards only when they are truly needed.
- Prefer full-width sections, editorial layouts, sticky scenes, media-led sections, and product closeups.

Hero sections:

- The brand/product must be obvious without relying only on the nav.
- Use a real product/lifestyle image or video whenever possible.
- Avoid hero cards.
- Avoid tiny centered headlines floating over empty space.
- Keep primary CTA visible and clear.
- Make mobile heroes feel designed, not merely stacked.

Product pages:

- Lead with product identity, magnification, use case, price/value, and primary CTA.
- Show the actual loupe product clearly.
- Make specs easy to scan.
- Give frame/color/product options enough visual affordance.
- Do not bury purchase actions below decorative content.

Checkout/cart:

- Prioritize clarity, trust, error prevention, and low-friction completion.
- Do not add flashy animation to payment-critical flows.
- Make totals, selected product, and next action impossible to miss.

## Motion And Interaction

Motion should feel expensive, not noisy.

Use motion for:

- Hero entrance sequencing
- Product reveal
- Scroll-linked storytelling
- Sticky image/product moments
- Smooth page section transitions
- Hover states that clarify affordance
- Menu, drawer, modal, and cart presence

Preferred tools:

- Framer Motion for React state, layout, entrance, hover, and scroll-linked animations
- GSAP for highly choreographed timelines or complex scroll sequences
- Lenis for smooth scrolling
- Three.js/R3F only when a real 3D/depth moment improves the product experience

Motion rules:

- Keep it smooth on mobile.
- Respect `prefers-reduced-motion`.
- Do not animate large layout shifts.
- Do not trap scrolling.
- Avoid long delays before useful content appears.
- Avoid animation that hides purchase actions or essential product information.
- Use one motion language per page. Do not mix random effects.

## Visual Assets

Use the assets in `public/` before inventing new placeholders. This repo already contains HeliosX logos, product images, frame images, lifestyle photos, checkout images, and videos.

Asset expectations:

- Use `next/image` for images where practical.
- Prefer real product/lifestyle visuals over abstract backgrounds.
- Crop intentionally.
- Maintain enough contrast for overlaid text.
- Avoid stretching, pixelation, and awkward object positioning.
- Do not use external images unless the user asks or the repo lacks an appropriate asset.
- Do not replace brand assets without permission.

When using video:

- Keep it muted/autoplay-safe when used as ambient hero media.
- Provide fallback poster imagery where possible.
- Avoid huge blocking loads above the fold.

## Typography And Layout

Typography should feel editorial, clean, and surgical.

Guidelines:

- Use a restrained type scale.
- No negative letter spacing unless already established and visually verified.
- Do not scale font size purely with viewport width in a way that breaks mobile.
- Keep line lengths comfortable.
- Match heading size to context. Not every heading is a hero.
- Prevent text overflow in buttons, nav, cards, and mobile layouts.

Layout rules:

- Align intentionally. Avoid random centering.
- Use negative space as structure.
- Make desktop feel composed and mobile feel native.
- Do not put cards inside cards.
- Do not let fixed headers cover anchors or first-screen content.
- Use stable dimensions/aspect ratios for product media, tiles, and interactive elements.

## Copywriting

Write like a premium medical product brand.

Good copy:

- Clear
- Specific
- Calm
- Confident
- Benefit-led
- Short enough to scan

Avoid:

- Hype language
- Vague wellness claims
- Fake testimonials
- Unsupported clinical claims
- Long paragraphs in marketing sections
- Design commentary in visible UI text

If writing medical, ergonomic, or optical claims, keep them conservative unless there is a source in the project.

## Accessibility

Accessibility is part of the design quality bar.

Always check:

- Semantic headings
- Keyboard navigation
- Visible focus states
- Alt text for meaningful images
- Decorative images hidden from screen readers when appropriate
- Color contrast
- Button/link names
- Dialog focus handling
- Mobile tap target size
- `prefers-reduced-motion`

Radix UI primitives are preferred for dialogs, navigation menus, and interactive primitives when they fit the need.

## Performance

This is a visual site, but it still needs to feel fast.

Watch for:

- Large images above the fold
- Heavy Three.js scenes
- Excessive client components
- Scroll listeners without cleanup
- Animation libraries loaded for tiny effects
- Layout thrash from measuring on every frame
- Unoptimized videos
- Overuse of blur/filter effects

Use dynamic imports for heavy browser-only visual components when appropriate. Keep ecommerce and checkout paths especially lean.

## Engineering Standards

Work with the existing code style.

General rules:

- Make focused changes.
- Do not rewrite unrelated pages.
- Do not remove user content or assets unless explicitly asked.
- Prefer component extraction when a section becomes hard to reason about.
- Prefer CSS Modules for complex page/section styling already using modules.
- Use Tailwind for small utilities where it fits the existing pattern.
- Keep client components scoped. Add `"use client"` only when needed.
- Do not introduce a new design system or state library without a strong reason.
- Do not hardcode secrets.
- Do not break Stripe checkout behavior.

Before changing shared components like `Header`, `Footer`, cart, checkout, or product templates, inspect where they are used.

## Available Skills And Plugin Mindset

Use every relevant tool or skill available in the current Claude environment. If a tool/plugin/skill is not actually available, do not pretend it is. Fall back to careful local inspection and implementation.

When available, use:

- Frontend/UI skill for premium visual direction, layout, hierarchy, and interaction design
- Next.js/Vercel guidance for App Router, routing, server/client boundaries, builds, deployment, and environment variables
- shadcn/Radix guidance for accessible primitives and polished controls
- React best-practices review after editing multiple React components
- Browser verification tools for visual inspection, responsive checks, and console errors
- GitHub tools only when the task involves PRs, issues, CI, or publishing
- Image generation/editing tools only when a bitmap asset is needed and existing repo assets are insufficient

Do not use tools just to use them. Use them when they materially improve the result.

## Workflow For UI Work

For meaningful visual work:

1. Inspect the relevant page/component/CSS.
2. Inspect existing assets in `public/`.
3. State the intended visual direction briefly.
4. Implement the design.
5. Run a build or lint check when practical.
6. Start the dev server when needed.
7. Verify in browser at desktop and mobile sizes.
8. Check console errors and obvious layout issues.
9. Refine until it looks finished.

Visual verification matters. Do not call a UI done based only on code compiling.

Responsive sizes to think about:

- Mobile: 390 x 844
- Tablet: 768 x 1024
- Desktop: 1440 x 900
- Wide: 1728 x 1117

## Commands

Common commands:

```bash
npm run dev
npm run build
npm run lint
```

Notes:

- `npm run dev` starts the Next.js development server.
- `npm run build` is the primary production safety check.
- `npm run lint` may depend on the local Next.js lint setup.

If a command fails, read the error and fix the root cause. Do not paper over build failures.

## Quality Bar Before Final Response

Before saying work is complete, confirm:

- The page still builds or the relevant check was attempted.
- No obvious TypeScript/React errors were introduced.
- Layout works on mobile and desktop.
- Text is readable and not overlapping.
- CTAs are visible and functional.
- Images load and are not distorted.
- Animations are smooth and restrained.
- Accessibility basics are respected.
- Checkout/cart/product flows were not accidentally broken.

If verification could not be run, say that clearly and explain why.

## Brand Taste Checklist

Use this checklist for every design pass:

- Is HeliosX unmistakable above the fold?
- Is there one strong visual anchor?
- Does the page feel premium without feeling generic?
- Does the copy sound calm and trustworthy?
- Is the product easy to understand and buy?
- Is motion adding clarity or atmosphere?
- Does mobile feel intentionally designed?
- Would the page still look good if shadows and decoration were reduced?
- Does anything feel like filler?

The goal is not merely to make the site "nice." The goal is to make HeliosX feel like a serious, desirable, beautifully engineered medical product brand.
