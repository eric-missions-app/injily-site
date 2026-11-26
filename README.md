# MissionsApp Marketing Website

A modern, high-converting marketing website for MissionsApp - a church management and mission coordination SaaS platform.

## 🚀 Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Font**: Manrope (Google Fonts)
- **Icons**: Material Symbols
- **Deployment**: Vercel

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18.17 or later
- npm, yarn, or pnpm package manager
- Git

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd missionsapp-website
```

### 2. Install Dependencies

Using npm:
```bash
npm install
```

Using yarn:
```bash
yarn install
```

Using pnpm:
```bash
pnpm install
```

### 3. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## 📁 Project Structure

```
missionsapp-website/
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Root layout with fonts and metadata
│   │   ├── page.tsx         # Main homepage
│   │   └── globals.css      # Global styles and Tailwind directives
│   └── components/
│       ├── Hero.tsx         # Hero section with CTA
│       ├── LogoCloud.tsx    # Trusted organizations logos
│       ├── Features.tsx     # Problem/Solution/Features section
│       ├── RoleBasedFeatures.tsx  # Role-based testimonials with tabs
│       ├── Testimonials.tsx # Customer testimonial cards
│       ├── CTA.tsx          # Call-to-action section
│       └── Footer.tsx       # Footer with navigation
├── public/                  # Static assets (add images here)
├── tailwind.config.js       # Tailwind CSS configuration
├── next.config.js           # Next.js configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies and scripts
```

## 🎨 Customization Guide

### Updating Content

#### Hero Section
Edit `src/components/Hero.tsx`:
- Change headline and description
- Update CTA button text and links

#### Features
Edit `src/components/Features.tsx`:
- Modify the `features` array to change icons, titles, and descriptions

#### Testimonials
Edit `src/components/Testimonials.tsx` and `src/components/RoleBasedFeatures.tsx`:
- Update the testimonial arrays with your own customer quotes
- Replace image URLs with your own

### Changing Brand Colors

Edit `tailwind.config.js`:
```javascript
colors: {
  primary: '#2c6ed5',           // Main brand color
  'primary-darker': '#023c69',   // Darker variant
  'primary-medium': '#4687c1',   // Medium variant
  // ... add your colors
}
```

### Adding Your Logo

1. Place your logo in the `public/` folder
2. Update the logo reference in `src/components/Footer.tsx`

### Updating Metadata (SEO)

Edit `src/app/layout.tsx`:
```typescript
export const metadata: Metadata = {
  title: 'Your Title',
  description: 'Your Description',
  // ... update other fields
}
```

## 🚀 Deployment to Vercel

### Method 1: Deploy via Vercel Dashboard (Recommended)

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings
   - Click "Deploy"

3. **Configure Custom Domain** (Optional):
   - In your Vercel project dashboard
   - Go to "Settings" → "Domains"
   - Add `missions-app.com`
   - Follow DNS configuration instructions
   - SSL is automatic!

### Method 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

## 🔧 Build Commands

```bash
# Development
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

## 📊 Performance Optimization

The website is optimized for performance with:
- ✅ Next.js Image component for optimized images
- ✅ Automatic code splitting
- ✅ Font optimization with `next/font`
- ✅ Lazy loading of components
- ✅ Framer Motion animations optimized for 60fps

## 🎯 Features Included

- ✅ Fully responsive design (mobile-first)
- ✅ Dark mode support (system preference)
- ✅ SEO optimized with meta tags
- ✅ Smooth scroll animations
- ✅ Image optimization
- ✅ TypeScript for type safety
- ✅ Fast page loads (<2s)
- ✅ Accessible (WCAG compliant)

## 📝 Next Steps

### Adding More Pages

1. Create a new file in `src/app/`:
   ```typescript
   // src/app/features/page.tsx
   export default function Features() {
     return <div>Features Page</div>
   }
   ```

2. Access at `/features`

### Adding Contact Form

Consider integrating:
- [Formspree](https://formspree.io/) - Free tier available
- [Web3Forms](https://web3forms.com/) - Simple API
- [Resend](https://resend.com/) - Modern email API

### Adding Analytics

Add Google Analytics in `src/app/layout.tsx`:
```typescript
<Script
  src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
  strategy="afterInteractive"
/>
```

## 🐛 Troubleshooting

### Images not loading
- Check that image URLs are accessible
- Verify `next.config.js` has correct domains listed

### Tailwind styles not applying
- Ensure `globals.css` is imported in `layout.tsx`
- Check that your files are included in `tailwind.config.js` content array

### Build errors
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Vercel Documentation](https://vercel.com/docs)

## 📄 License

Copyright © 2024 MissionsApp. All rights reserved.

## 🤝 Support

For questions or issues, please contact support or open an issue on GitHub.

---

**Built with ❤️ using Next.js and Tailwind CSS**
