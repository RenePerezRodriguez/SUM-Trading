# Changelog

All notable changes to SUM Trading Portal will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.2.0] - 2025-11-30

### 🎨 UX/UI Enhancements & Production Fixes

#### Added
- 🧠 **Neuromarketing Principles** - Applied to chatbot for emotional connection
- 🎯 **Quick Replies System** - 2x2 grid with gradient backgrounds inside chat area
- ✨ **Microinteractions** - Button animations (hover:rotate-12, scale-110, ping effects)
- 📝 **Documentation Scripts** - Automated troubleshooting tools
- 🔐 **Secrets Management** - Migrated API keys to Firebase Cloud Secret Manager

#### Fixed
- 🔧 **Chatbot UX** - Removed file upload and voice features, optimized for mobile
- 🔧 **Social Networks** - Repositioned inline with header (smaller icons)
- 🔧 **GEMINI_API_KEY** - Configured as secret instead of exposed value
- 🔧 **Admin Permissions** - Added script to fix role assignments and custom claims

#### Changed
- 🎨 **Chatbot Empty State** - Enhanced with ping animation and gradient text
- 🎨 **Quick Replies** - Moved from separate section to inside messages area (only when empty)
- 🎨 **Input Field** - Removed emoji placeholder, cleaner design with gradient button
- 🎨 **Character Counter** - Only visible when typing (< 300 chars warning)
- 📦 **Deployment Method** - Added local source deploy (`firebase deploy --only apphosting`)

#### Security
- 🔐 **API Keys as Secrets** - All sensitive keys moved to Cloud Secret Manager
- 🔐 **Admin Role Verification** - Enhanced with custom claims sync

#### Technical Details
- **Secrets**: Firebase App Hosting Cloud Secret Manager integration
- **Scripts**: TypeScript diagnostic and fix scripts in `scripts/`
- **Documentation**: Consolidated deployment and troubleshooting guides

#### Files Added/Modified
- `src/components/chatbot/chatbot-widget.tsx` - Neuromarketing UX redesign
- `scripts/fix-admin-permissions.ts` - Automated admin role fix
- `scripts/check-chatbot-env.ts` - Gemini API diagnostics
- `docs/DEPLOYMENT.md` - Complete rewrite with new methods
- `docs/PRODUCTION-FIXES.md` - Troubleshooting guide
- `PRODUCTION-QUICK-FIX.md` - Quick reference guide
- `apphosting.yaml` - GEMINI_API_KEY as secret

---

## [1.1.0] - 2025-11-29

### 🎉 Initial Production Release

#### Added
- ✨ **Multi-language Support** - Full English/Spanish (EN/ES) internationalization
- 🔍 **Copart Integration** - Real-time vehicle search with ScraptPress API
- 💳 **Stripe Payments** - Secure checkout with multiple payment methods
- 👤 **User Authentication** - Firebase Auth (Email/Password + Google)
- ⭐ **Favorites System** - Save and manage favorite vehicles
- 🚘 **Virtual Garage** - Track purchased vehicles
- 📱 **PWA Support** - Offline functionality, installable app
- 🎨 **Modern UI** - shadcn/ui + Tailwind CSS + Framer Motion
- 📊 **Analytics** - Google Analytics + Microsoft Clarity
- 🔔 **Cookie Consent** - GDPR-compliant cookie management
- 📧 **Contact Forms** - WhatsApp integration + email forms
- 🎯 **SEO Optimization** - Dynamic sitemaps, robots.txt, meta tags
- 🔐 **Security** - CORS, API validation, Stripe webhooks
- 📈 **Performance** - 95+ Lighthouse score, optimized assets

#### Project Structure
- Next.js 16 with App Router
- TypeScript 5.5 strict mode
- Firebase Hosting deployment
- Modular component architecture
- Responsive design (mobile-first)

#### Developer Experience
- Turbopack dev server
- ESLint + Prettier
- TypeScript strict mode
- Hot module replacement
- Environment variable validation

---

## [1.1.0] - 2025-11-29

### 🤖 AI Chatbot Enhancements

#### Added
- ✨ **Advanced Typing Indicator** - Animated dots with staggered bounce effect (replaces skeleton)
- 📎 **File Upload System** - Image upload with preview (5MB limit, validation)
- 🎤 **Voice Input** - Web Speech API integration for Spanish voice commands
- 🌐 **Multi-language Detection** - Auto-detect ES/EN, responds in same language
- 💬 **Dynamic Contextual Suggestions** - 6 categories with bilingual keywords
- ⚡ **3-Level Cache System** - Instant responses (pre-cached + 1-hour cache)

#### Fixed
- 🔧 **Gemini Model Issues** - Switched to `gemini-2.5-pro` from preview models
- 🔧 **Token Allocation** - Increased `maxOutputTokens` from 512 to 8192 (16x)
- 🔧 **Thinking Token Overhead** - Added `systemInstruction` to prevent token waste
- 🔧 **Language Detection** - Enhanced regex with 20+ Spanish keywords
- 🔧 **Contextual Suggestions** - Now render as separate message (not inline)

#### Technical Details
- **Model**: gemini-2.5-pro (stable, production-ready)
- **Max Tokens**: 8192 (was 512)
- **Cache**: ServerCache with 1-hour TTL, 8 pre-cached responses
- **Voice**: Web Speech API (es-ES)
- **Upload**: FileReader API, base64 conversion
- **Suggestions**: 6 categories (tarifas, proceso, contacto, servicio, importación, vehículo)

#### Files Modified
- `src/lib/gemini.ts` - Model upgrade + language detection
- `src/components/chatbot/chatbot-widget.tsx` - All 6 advanced features
- `src/app/api/chatbot/route.ts` - Cache integration
- `src/lib/cache.ts` - Chatbot cache functions
- `apphosting.yaml` - Added GEMINI_API_KEY secret

---

## [Unreleased]

### Planned
- 📧 Email notification system
- 🤖 AI-powered vehicle recommendations
- 🎯 Advanced filtering
- 📱 React Native mobile app
- 💰 PayPal + Crypto payment methods
- 🏷️ Auction bidding system

---

## Version History

### v1.0.0 (Nov 14, 2024)
- Initial production release
- Deployed to https://sumtrading.us
- Full feature set complete
- Performance optimized
- Security hardened
- Documentation complete

---

**Note:** For detailed commit history, see the [Git log](https://github.com/RenePerezRodriguez/SUM-Trading-repo/commits/main).
