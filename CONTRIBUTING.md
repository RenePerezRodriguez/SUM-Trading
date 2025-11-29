# Contributing to SUM Trading Portal

Thank you for your interest in contributing! This is a **proprietary project** developed for SUM Trading.

## 🔒 Project Status

This is a **closed-source, proprietary project**. Contributions are limited to:
- Internal team members
- Contracted developers
- Authorized partners

## 👥 Team Members

If you're part of the development team, please follow these guidelines:

### Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/RenePerezRodriguez/SUM-Trading-repo.git
   cd SUM-Trading-repo
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment:**
   ```bash
   cp .env.example .env.local
   # Add your credentials
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```

### Development Workflow

#### Branch Strategy

```
main (protected)
  └── develop
       ├── feature/user-authentication
       ├── feature/payment-integration
       ├── fix/mobile-responsive
       └── docs/update-readme
```

**Branch Naming:**
- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Testing improvements
- `chore/` - Maintenance tasks

#### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add vehicle comparison feature
fix: resolve mobile navigation issue
docs: update API documentation
style: format code with prettier
refactor: simplify payment flow
test: add unit tests for auth
chore: update dependencies
```

**Examples:**
```bash
git commit -m "feat: add favorites filtering by make/model"
git commit -m "fix: resolve Stripe webhook signature validation"
git commit -m "docs: add deployment instructions for Firebase"
```

### Code Standards

#### TypeScript

```typescript
// ✅ GOOD
interface VehicleData {
  lotNumber: string;
  vin: string;
  make: string;
  model: string;
}

export async function fetchVehicle(id: string): Promise<VehicleData> {
  // Implementation
}

// ❌ BAD
function fetchVehicle(id) {
  // No types
}
```

#### React Components

```tsx
// ✅ GOOD - Typed props, clear naming
interface VehicleCardProps {
  vehicle: VehicleData;
  onFavorite: (id: string) => void;
}

export function VehicleCard({ vehicle, onFavorite }: VehicleCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{vehicle.make} {vehicle.model}</CardTitle>
      </CardHeader>
    </Card>
  );
}

// ❌ BAD - No types, unclear naming
export function Card1({ data, callback }) {
  return <div>{data.name}</div>;
}
```

#### File Organization

```
src/
├── app/
│   └── [lang]/
│       └── feature-name/
│           ├── page.tsx          # Main page
│           ├── layout.tsx        # Layout (if needed)
│           └── _components/      # Private components
│               ├── feature-form.tsx
│               └── feature-list.tsx
├── components/
│   ├── ui/                       # shadcn/ui components
│   └── shared/                   # Shared components
├── lib/
│   └── utils.ts                  # Utilities
└── types/
    └── feature.types.ts          # Type definitions
```

### Testing

#### Before Committing

```bash
# Type check
npm run typecheck

# Lint
npm run lint

# Build test
npm run build
```

#### Manual Testing Checklist

- [ ] Test on Chrome, Firefox, Safari
- [ ] Test on mobile (iOS + Android)
- [ ] Test both EN and ES languages
- [ ] Test authentication flow
- [ ] Test payment flow (use Stripe test mode)
- [ ] Test Copart search
- [ ] Check console for errors
- [ ] Verify no TypeScript errors

### Pull Request Process

1. **Create Feature Branch:**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. **Make Changes:**
   - Write clean, documented code
   - Follow code standards
   - Add comments for complex logic

3. **Commit Changes:**
   ```bash
   git add .
   git commit -m "feat: add your feature"
   ```

4. **Push to Remote:**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create Pull Request:**
   - Base: `develop`
   - Compare: `feature/your-feature-name`
   - Add description of changes
   - Reference any issues

6. **Code Review:**
   - Wait for review from team lead
   - Address feedback
   - Make requested changes

7. **Merge:**
   - Once approved, merge to `develop`
   - Delete feature branch

### Environment Variables

**Never commit:**
- `.env.local` - Local development
- `.env.production` - Production secrets
- Firebase service account JSON
- Stripe secret keys
- API keys

**Always use:**
- `.env.example` - Template for required variables

### Security Guidelines

- ✅ Use environment variables for secrets
- ✅ Validate all user inputs
- ✅ Sanitize data before display
- ✅ Use HTTPS in production
- ✅ Keep dependencies updated
- ❌ Never log sensitive data
- ❌ Never commit credentials
- ❌ Never expose API keys client-side

### Performance Guidelines

- ✅ Optimize images (WebP, lazy loading)
- ✅ Use Next.js Image component
- ✅ Minimize bundle size
- ✅ Code splitting
- ✅ Server components when possible
- ❌ Avoid large dependencies
- ❌ Don't block rendering
- ❌ Minimize client-side JavaScript

### Deployment

Only authorized team members can deploy:

**Staging:**
```bash
npm run build
firebase deploy --only hosting:staging
```

**Production:**
```bash
npm run build
firebase deploy --only hosting:studio
```

### Getting Help

- 📖 Check [README.md](README.md) for setup
- 📋 Review [DEPLOYMENT-GUIDE.md](DEPLOYMENT-GUIDE.md) for deployment
- 📚 Browse [docs/](docs/) for detailed documentation
- 💬 Ask in team chat for questions
- 📧 Contact: Rene_Perez@outlook.it

---

## 📞 Contact

**Project Lead:** Rene Perez Rodriguez
- Email: Rene_Perez@outlook.it
- GitHub: [@RenePerezRodriguez](https://github.com/RenePerezRodriguez)

---

**Remember:** This is proprietary software. All code and documentation are confidential. 🔒
