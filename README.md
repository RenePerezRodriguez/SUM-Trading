# 🚗 SUM Trading Portal

**Professional Next.js platform for importing auction vehicles from the USA.** Multi-language support, Stripe payments, Firebase backend, and real-time Copart integration.

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Hosting-orange?logo=firebase)](https://firebase.google.com/)
[![Production](https://img.shields.io/badge/Live-sumtrading.us-success)](https://sumtrading.us)

---

## 🌟 Features

### Core Functionality
- 🔍 **Real-time Copart Search** - Live vehicle search with intelligent caching (< 2s cached, ~4min fresh scraping)
- 🛒 **Secure Checkout** - Stripe integration with multiple payment methods
- 👤 **User Management** - Firebase Auth with email/password and Google sign-in
- 🌍 **Multi-language** - Full support for English and Spanish (ES/EN)
- 📱 **PWA Ready** - Offline support, installable, mobile-optimized
- 🎨 **Modern UI** - shadcn/ui + Tailwind CSS + Framer Motion animations

### User Experience
- 🤖 **AI Chatbot** - Intelligent assistant powered by Google Gemini 2.5 Pro with neuromarketing UX
- ⭐ **Favorites System** - Save and manage favorite vehicles
- 🚘 **Virtual Garage** - Track purchased vehicles and history
- 💳 **Payment History** - Complete transaction records
- 📧 **Email Notifications** - Order confirmations and updates
- 📞 **Contact Integration** - WhatsApp click-to-chat, contact forms
- 🔔 **Cookie Consent** - GDPR-compliant cookie management

### Technical Excellence
- 🚀 **Performance** - 95+ Lighthouse score, optimized images, lazy loading
- 🔐 **Security** - CORS configured, API key validation, secure payments
- 📊 **Analytics** - Google Analytics, Microsoft Clarity, conversion tracking
- 🎯 **SEO** - Dynamic sitemaps, robots.txt, Open Graph, structured data
- 🌐 **CDN** - Firebase Hosting with global edge locations

---

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- Next.js 16 (App Router + React Server Components)
- TypeScript 5.5
- Tailwind CSS 4.0
- shadcn/ui (Radix UI primitives)
- Framer Motion (animations)
- React Hook Form + Zod (form validation)
- Zustand (state management)

**Backend & Services:**
- Firebase Authentication (user management)
- Firebase Firestore (database)
- Firebase App Hosting (deployment)
- Stripe (payments)
- ScraptPress API (Copart scraping - Cloud Run)
- Google Gemini 1.5 Flash (AI chatbot)

**Dev Tools:**
- TypeScript (type safety)
- ESLint (code quality)
- Prettier (code formatting)
- Turbopack (dev server)

### Project Structure

```
src/
├── app/
│   ├── [lang]/               # Internationalized routes
│   │   ├── about/           # About page
│   │   ├── admin/           # Admin panel
│   │   ├── auth/            # Auth pages (login/register/reset)
│   │   ├── cars/            # Vehicle catalog & details
│   │   ├── checkout/        # Payment flow
│   │   ├── contact/         # Contact page
│   │   ├── copart/          # Copart search & results
│   │   ├── faq/             # FAQ page
│   │   ├── garage/          # User's purchased vehicles
│   │   ├── how-it-works/    # How it works guide
│   │   ├── payment/         # Payment success/update pages
│   │   ├── privacy/         # Privacy policy
│   │   ├── profile/         # User profile & settings
│   │   ├── purchases/       # Purchase history
│   │   ├── search/          # Search page
│   │   ├── terms/           # Terms of service
│   │   └── page.tsx         # Home page
│   ├── api/                 # API routes
│   │   ├── auth/            # Authentication endpoints
│   │   ├── create-payment-intent/ # Stripe payment
│   │   ├── stripe-webhook/  # Stripe webhooks
│   │   └── user-action/     # User actions (favorites, garage)
│   └── layout.tsx           # Root layout
├── components/
│   ├── auth/                # Auth components (login, register)
│   ├── layout/              # Layout components (header, footer, nav)
│   ├── sections/            # Homepage sections
│   ├── ui/                  # shadcn/ui components
│   └── ...                  # Shared components
├── firebase/
│   ├── admin.ts             # Firebase Admin SDK
│   └── client.ts            # Firebase Client SDK
├── hooks/                   # Custom React hooks
├── lib/
│   ├── i18n-config.ts       # Internationalization config
│   ├── utils.ts             # Utility functions
│   └── stripe.ts            # Stripe utilities
├── locales/
│   ├── en/                  # English translations (split by feature)
│   │   ├── common.json
│   │   ├── home.json
│   │   └── ...
│   └── es/                  # Spanish translations (split by feature)
│       ├── common.json
│       ├── home.json
│       └── ...
└── types/                   # TypeScript type definitions

public/
├── favicon/                 # Favicon assets
├── images/                  # Static images
│   └── logos/              # Brand logos
├── manifest.json           # PWA manifest
└── service-worker.ts       # Service worker
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- Firebase project configured
- Stripe account (for payments)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/RenePerezRodriguez/SUM-Trading-repo.git
   cd SUM-Trading-repo
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env.local
   ```

   Required environment variables:
   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
   NEXT_PUBLIC_FIREBASE_APP_ID=
   
   # Firebase Admin SDK (server-side)
   FIREBASE_SERVICE_ACCOUNT_JSON=
   
   # Stripe
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
   STRIPE_SECRET_KEY=
   STRIPE_WEBHOOK_SECRET=
   
   # ScraptPress API (Copart Scraping)
   SCRAPTPRESS_API_URL=https://scrap.sumtrading.us
   SCRAPTPRESS_API_KEY=
   
   # Site Configuration
   NEXT_PUBLIC_SITE_URL=https://sumtrading.us
   
   # AI Chatbot
   GEMINI_API_KEY=
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```

   Open [http://localhost:9002](http://localhost:9002)

5. **Build for production:**
   ```bash
   npm run build
   npm start
   ```

---

## 🔧 Configuration

### Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Authentication (Email/Password + Google)
3. Create Firestore database
4. Add web app and copy configuration to `.env.local`
5. Download service account JSON for server-side operations

### Stripe Setup

1. Create Stripe account at [stripe.com](https://stripe.com)
2. Get API keys from Dashboard
3. Configure webhook endpoint: `https://sumtrading.us/api/stripe-webhook`
4. Add webhook secret to `.env.local`

### ScraptPress API

The Copart scraping is handled by a separate backend API:
- Repository: [ScraptPress](https://github.com/RenePerezRodriguez/ScraptPress)
- Production: `https://scrap.sumtrading.us`
- Local development: `http://localhost:3000`

---

## 📝 Development

### Available Scripts

```bash
npm run dev          # Start dev server (Turbopack) on port 9002
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run typecheck    # TypeScript type checking
```

### Code Style

- **TypeScript** - Strict mode enabled
- **ESLint** - Enforced code quality
- **Prettier** - Consistent formatting
- **Conventional Commits** - Semantic commit messages

### Branch Strategy

- `main` - Production-ready code (deployed to sumtrading.us)
- `develop` - Development branch
- `feature/*` - New features
- `fix/*` - Bug fixes

---

## 🚢 Deployment

### Production Status

- ✅ **Live:** [https://sumtrading.us](https://sumtrading.us)
- ✅ **Backend API:** [https://scrap.sumtrading.us](https://scrap.sumtrading.us)
- ✅ **Platform:** Firebase App Hosting
- ✅ **CDN:** Global edge locations with automatic SSL

### Quick Deploy

```bash
# Install dependencies
npm install

# Build production bundle
npm run build

# Deploy to Firebase
firebase deploy --only hosting
```

### Environment Variables

All environment variables are configured in Firebase App Hosting console. For local development, copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

See `.env.example` for the complete list with descriptions.

---

## 🌍 Internationalization (i18n)

### Supported Languages

- English (en) - Default
- Spanish (es)

### Adding Translations

1. Edit `src/locales/en/common.json`, `src/locales/en/home.json`, etc.
2. Use in components:
   ```tsx
   import { getDictionary } from '@/lib/get-dictionary';
   
   const dict = await getDictionary(lang);
   <h1>{dict.home.title}</h1>
   ```

### URL Structure

- English: `sumtrading.us/en/...`
- Spanish: `sumtrading.us/es/...`
- Root redirects to browser language or English

---

## 🔐 Security

- ✅ CORS configured for API endpoints
- ✅ API key validation for ScraptPress
- ✅ Stripe webhook signature verification
- ✅ Firebase security rules
- ✅ Environment variables never committed
- ✅ Helmet.js security headers
- ✅ HTTPS enforced in production

---

## 📊 Analytics & Monitoring

### Google Analytics
- Page views tracking
- Event tracking (purchases, searches, favorites)
- Conversion tracking

### Microsoft Clarity
- Session recordings
- Heatmaps
- User behavior analysis

---

## 📄 License

**Proprietary Software** - All rights reserved.

This software is developed for **SUM Trading** and is proprietary. Unauthorized copying, modification, distribution, or use of this software is strictly prohibited.

Copyright © 2024-2025 Rene Perez Rodriguez

---

## 👤 Author

**Rene Perez Rodriguez**
- Email: Rene_Perez@outlook.it
- GitHub: [@RenePerezRodriguez](https://github.com/RenePerezRodriguez)

---

## 🤝 Support

For questions, issues, or feature requests:
1. Check [Documentation](docs/README.md)
2. Review [Deployment Guide](DEPLOYMENT-GUIDE.md)
3. Contact the development team

---

## 🎯 Roadmap

### ✅ Completed (v1.0)
- Multi-language support (EN/ES)
- Copart integration with real-time search
- Stripe payment processing
- User authentication and profiles
- Favorites and garage system
- PWA functionality
- Production deployment

### 🚧 In Progress
- Admin panel enhancements
- Advanced vehicle filtering
- Email notification system
- Mobile app (React Native)

### 📋 Planned
- Additional payment methods (PayPal, Crypto)
- AI-powered vehicle recommendations
- Live chat support
- Auction bidding system
- API v2 with GraphQL

---

## ⚡ Performance

### Lighthouse Scores
- Performance: 95+
- Accessibility: 100
- Best Practices: 100
- SEO: 100

### Key Metrics
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 3.0s
- Cumulative Layout Shift: < 0.1

---

**Built with ❤️ for SUM Trading** | 🌐 [sumtrading.us](https://sumtrading.us)
