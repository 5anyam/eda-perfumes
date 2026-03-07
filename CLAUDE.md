# EDA Perfumes D'Crayons

## Project Overview
E-commerce website for EDA Perfumes D'Crayons built with Next.js 15 and WooCommerce as headless CMS.

## Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4, tailwindcss-animate
- **UI Components:** Radix UI, shadcn/ui, Lucide icons, Tabler icons, Heroicons
- **State/Data:** TanStack React Query
- **Forms:** React Hook Form + Zod validation
- **Animations:** Framer Motion
- **Payments:** Razorpay
- **Analytics:** Facebook Pixel
- **CMS/Backend:** WordPress + WooCommerce (headless)

## Key URLs
- **WordPress Admin:** https://cms.amraj.in/wp-admin
- **WooCommerce API:** https://cms.amraj.in/wp-json/wc/v3 (should match `API_BASE` in `.env`)

## Project Structure
```
src/app/          - Next.js App Router pages
  api/            - API routes (woocommerce/, razorpay/)
  product/        - Product pages
  shop/           - Shop/catalog pages
  cart/           - Cart page
  checkout/       - Checkout flow
  dashboard/      - User dashboard
  login/          - Auth pages
  blogs/          - Blog pages
  about/          - About page
  contact/        - Contact page
components/       - React components
lib/              - Utilities (woocommerceApi.ts, wordpress-auth.ts)
```

## Commands
```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run ESLint
```

## Environment Variables
All env vars are in `.env` at root. Key variables:
- `API_BASE` - WooCommerce REST API base URL
- `NEXT_PUBLIC_WORDPRESS_URL` - WordPress site URL
- `NEXT_PUBLIC_CONSUMER_KEY` / `NEXT_PUBLIC_CONSUMER_SECRET` - WooCommerce API keys
- `NEXT_PUBLIC_RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` - Razorpay credentials
- `NEXT_PUBLIC_FACEBOOK_PIXEL_ID` - Facebook Pixel tracking

## Deployment
- Deployed on **Vercel**
- Environment variables must also be set in Vercel project settings
