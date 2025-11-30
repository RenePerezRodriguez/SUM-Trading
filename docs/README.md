# 📚 SUM Trading Portal - Documentation

Complete documentation for the SUM Trading vehicle import platform.

## 📋 Table of Contents

1. [Getting Started](#getting-started)
2. [Architecture](#architecture)
3. [Features](#features)
4. [Development](#development)
5. [Deployment](#deployment)
6. [API Reference](#api-reference)

---

## 🚀 Getting Started

### Quick Start

```bash
# Clone repository
git clone https://github.com/RenePerezRodriguez/SUM-Trading-repo.git
cd SUM-Trading-repo

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your credentials

# Run development server
npm run dev
```

Visit [http://localhost:9002](http://localhost:9002)

### Documentation Files

- **[README.md](../README.md)** - Main project overview
- **[.env.example](../.env.example)** - Environment variables template
- **[CONTRIBUTING.md](../CONTRIBUTING.md)** - Contribution guidelines
- **[CHANGELOG.md](../CHANGELOG.md)** - Version history
- **[blueprint.md](blueprint.md)** - Original project blueprint
- **[backend.json](backend.json)** - Backend API specification

---

## 🏗️ Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    SUM Trading Platform                      │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐         ┌──────────────┐                  │
│  │   Next.js    │◄────────┤   Firebase   │                  │
│  │   Frontend   │         │   Hosting    │                  │
│  └──────────────┘         └──────────────┘                  │
│         │                                                     │
│         ├─► Firebase Auth (User Management)                 │
│         ├─► Firestore (Database)                            │
│         ├─► Stripe API (Payments)                           │
│         └─► ScraptPress API (Copart Scraping)              │
│                     │                                         │
│                     └─► Cloud Run Container                 │
│                            (Playwright + Chromium)           │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

### Technology Stack

**Frontend:**
- Next.js 16 (App Router, RSC)
- TypeScript 5.5
- Tailwind CSS + shadcn/ui
- Framer Motion
- React Hook Form + Zod

**Backend Services:**
- Firebase Authentication
- Firebase Firestore
- Firebase Hosting
- Stripe Payments
- ScraptPress API (Cloud Run)

**Development:**
- Turbopack (dev server)
- ESLint + Prettier
- TypeScript Strict Mode

---

## ✨ Features

### User Features

1. **Multi-language Support**
   - English (EN)
   - Spanish (ES)
   - URL-based: `/en/...` or `/es/...`

2. **Vehicle Search**
   - Real-time Copart search
   - Intelligent caching
   - Batch loading (100 vehicles)
   - Filter by make, model, year

3. **User Account**
   - Email/Password registration
   - Google Sign-In
   - Profile management
   - Password reset

4. **Favorites & Garage**
   - Save favorite vehicles
   - Track purchases
   - View history

5. **Secure Checkout**
   - Stripe integration
   - Multiple payment methods
   - Order confirmation emails
   - Payment history

### Technical Features

1. **Performance**
   - 95+ Lighthouse score
   - Image optimization
   - Lazy loading
   - Code splitting

2. **SEO**
   - Dynamic sitemaps
   - Meta tags
   - Open Graph
   - Structured data

3. **Security**
   - CORS configuration
   - API key validation
   - Stripe webhooks
   - Environment variables

4. **PWA**
   - Offline support
   - Installable
   - Service worker
   - Manifest.json

---

## 💻 Development

### Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── [lang]/            # Internationalized routes
│   ├── api/               # API routes
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── auth/             # Authentication
│   ├── layout/           # Layout components
│   ├── sections/         # Homepage sections
│   └── ui/               # shadcn/ui
├── firebase/             # Firebase config
├── hooks/                # Custom hooks
├── lib/                  # Utilities
├── locales/              # Translations
└── types/                # TypeScript types
```

### Environment Variables

See [.env.example](../.env.example) for complete list.

Required variables:
- Firebase (client + admin)
- Stripe (keys + webhook)
- ScraptPress API
- Site URL

### Available Scripts

```bash
npm run dev          # Development server (port 9002)
npm run build        # Production build
npm start            # Production server
npm run lint         # ESLint
npm run typecheck    # TypeScript check
```

### Code Standards

- TypeScript strict mode
- ESLint rules enforced
- Prettier formatting
- Conventional Commits

---

## 🚢 Deployment

### Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Deploy
npm run build
firebase deploy --only hosting:studio
```

**Live:** [https://sumtrading.us](https://sumtrading.us)

### Environment Setup

1. Configure variables in Firebase App Hosting
2. Upload service account JSON
3. Set Stripe keys
4. Configure ScraptPress API key

See [DEPLOYMENT-GUIDE.md](../DEPLOYMENT-GUIDE.md) for details.

---

## 📖 API Reference

### Internal API Routes

**Authentication:**
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Sign in
- `POST /api/auth/reset-password` - Reset password

**Payments:**
- `POST /api/create-payment-intent` - Create Stripe payment
- `POST /api/stripe-webhook` - Handle Stripe events

**User Actions:**
- `POST /api/user-action` - Favorites, garage, profile

### External APIs

**ScraptPress (Copart Scraping):**
- `GET /api/copart-search?query=...&page=...`
- Returns: Vehicle data with caching
- Cache: < 2s (Firestore), ~4min (fresh scrape)

**Firebase:**
- Authentication SDK
- Firestore SDK
- Client + Admin SDKs

**Stripe:**
- Payment Intents API
- Webhooks
- Customer Portal

---

## 🔍 Key Concepts

### Internationalization (i18n)

Routes use `[lang]` dynamic segment:
```
/en/about → English About page
/es/about → Spanish About page
```

Translations in `src/locales/`:
```json
// en/common.json
{
  "home": {
    "title": "Welcome"
  }
}

// es/common.json
{
  "home": {
    "title": "Bienvenido"
  }
}
```

### Copart Integration

1. User searches for vehicle
2. Frontend calls `/api/copart-search`
3. Backend checks Firestore cache
4. If not cached, scrapes Copart
5. Returns results with images, VIN, details

### Payment Flow

1. User adds vehicle to cart
2. Clicks checkout
3. Stripe Payment Element loads
4. User enters payment info
5. Frontend creates payment intent
6. Stripe processes payment
7. Webhook confirms payment
8. Order saved to Firestore
9. Confirmation email sent

---

## 📚 Additional Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Firebase Docs](https://firebase.google.com/docs)
- [Stripe Docs](https://stripe.com/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

## 🤝 Support

Questions? Contact:
- **Email:** Rene_Perez@outlook.it
- **GitHub:** [@RenePerezRodriguez](https://github.com/RenePerezRodriguez)

---

**Last Updated:** November 14, 2024
