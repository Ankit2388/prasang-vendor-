# 🍽️ Prasang Vendor Frontend Application (`prasang-vendor`)

> Scalable, modular, and production-ready **Vendor & Caterer Management Frontend** for the **Prasang Event & Catering Platform**, built with **Next.js (App Router)**, **TypeScript**, **Tailwind CSS**, and **TanStack Query**.

---

## 📋 Table of Contents
- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Multi-Theme Design System](#-multi-theme-design-system)
- [Multi-Language Localization (i18n)](#-multi-language-localization-i18n)
- [Architecture & Directory Structure](#-architecture--directory-structure)
- [Backend Integration & Authentication](#-backend-integration--authentication)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [Testing & Quality Verification](#-testing--quality-verification)

---

## 🌟 Project Overview

**Prasang Vendor Portal** allows caterers, banquet managers, and catering vendors to manage their businesses, create multi-course catering menus, catalog dishes and pricing, track customer reviews, and review client catering quotations and estimation requests.

It integrates with the existing **Prasang Backend (`prasang-server`)** RESTful API services without inventing any endpoints or violating existing backend data models.

---

## ✨ Key Features

1. **Vendor Authentication & Session Management**:
   - Vendor registration (`POST /api/v1/auth/register/vendor`)
   - Vendor credentials sign-in (`POST /api/v1/auth/login/vendor`)
   - Auto session retrieval (`GET /api/v1/auth/me`)
   - Automatic JWT token rotation via refresh tokens (`POST /api/v1/auth/refresh-token`)
   - Protected dashboard routes with client-side guards

2. **Vendor Dashboard**:
   - Real-time catering performance metrics: Total Quotations, Pending Inquiries, Confirmed Bookings, and Rating (`GET /api/v1/vendors/dashboard`)
   - Active business identity status snapshot
   - Recent client inquiries table
   - Quick navigation shortcuts

3. **1:1 Business Profile Management**:
   - View vendor profile (`GET /api/v1/businesses/my-business`)
   - Enforce 1:1 business policy: create new business profile if not existing (`POST /api/v1/businesses`)
   - Update business name, description, cuisine tags, guest capacity limits, contact info, and 7-day consultation schedule (`PUT /api/v1/businesses/:id`)

4. **Menu Package Management**:
   - Multi-course catering packages (Wedding Feast, Corporate Buffet, High-Tea, Reception)
   - Filter & view business menus (`GET /api/v1/menus/business/:businessId`)
   - Add new menu modal (`POST /api/v1/menus`)
   - Edit menu details (`PUT /api/v1/menus/:id`)
   - Delete menu package with confirmation (`DELETE /api/v1/menus/:id`)

5. **Menu Items (Dishes) Catalog**:
   - Individual dish management with category, price per plate/item, description, and images
   - Filter dishes by assigned Menu Package and Course Category
   - Instant search by dish name or ingredient
   - Pure Vegetarian (`Pure Veg`) vs `Non-Veg` badge indicators
   - Real-time availability toggle (`Available Today` / `Out of Stock`)
   - Add Dish modal (`POST /api/v1/menu-items`)
   - Edit Dish modal (`PUT /api/v1/menu-items/:id`)
   - Delete Dish confirmation (`DELETE /api/v1/menu-items/:id`)

6. **Feedback & Reviews**:
   - Rating score analytics and 5-star to 1-star visual breakdown
   - Verified event host testimonials (`GET /api/v1/reviews/business/:businessId`)
   - Star ratings and customer comments

---

## 🎨 Multi-Theme Design System

Centralized theme CSS variables are defined in `src/app/globals.css` and can be toggled dynamically via the theme switch in the top navigation bar. Theme selection is persisted across browser sessions in `localStorage`.

### Theme 1: Prasang Default Theme
- **Primary 500**: `#EF4C18`
- **Primary 600**: `#C83E12`
- **Primary 100**: `#FBEFE5`
- **Primary 50**: `#FFF6F1`
- **Background**: `#FDF6F2`
- **Surface**: `#FDFAF9`
- **Surface 2**: `#F9F3F0`
- **Text Primary**: `#282024`
- **Text Secondary**: `#504C4C`
- **Text Muted**: `#8A8181`
- **Border**: `#DDCEC4`
- **Gold Accent**: `#E8AE75`
- **Brown Accent**: `#926A45`

### Theme 2: Royal Emerald & Gold (Alternative Theme)
- **Primary 500**: `#0F5132` (Regal Royal Emerald)
- **Primary 600**: `#0B3D26` (Deep Forest Emerald)
- **Primary 100**: `#E8F5E9` (Soft Mint Glow)
- **Primary 50**: `#F2F9F4` (Fresh Emerald Tint)
- **Background**: `#F4F7F5` (Subtle Sage-Ivory Mist)
- **Surface**: `#FCFDFD` (Opulent Surface)
- **Surface 2**: `#EBF1EE` (Panel Tint)
- **Text Primary**: `#14241C` (Deep Pine Charcoal)
- **Text Secondary**: `#3D5245` (Balanced Slate Moss)
- **Text Muted**: `#6E8074` (Muted Sage Grey)
- **Border**: `#CFDBD3` (Soft Laurel Mist Border)
- **Gold Accent**: `#C59B27` (Regal Metallic Gold)
- **Brown Accent**: `#8A6715` (Burnished Bronze Gold)

---

## 🌐 Multi-Language Localization (i18n)

Full English (`en`) and Hindi (`hi`) translations are stored in structured JSON files:
- `src/i18n/messages/en.json`
- `src/i18n/messages/hi.json`

The system uses `LanguageProvider` with persistent selection in `localStorage` and a type-safe `t('namespace.key')` translation helper. The architecture is fully extensible for Gujarati (`gu`) and other regional languages.

---

## 🏗️ Architecture & Directory Structure

```text
src/
├── app/
│   ├── globals.css              # Centralized multi-theme CSS variables & Tailwind v4 theme
│   ├── layout.tsx               # Root application layout wrapping AppProviders
│   ├── page.tsx                 # Landing page & auto-redirect for authenticated vendors
│   ├── login/page.tsx           # Vendor Login screen with demo fast-fill
│   ├── register/page.tsx        # Vendor Registration screen
│   ├── dashboard/page.tsx       # Analytics & performance dashboard
│   ├── business/page.tsx        # 1:1 Business Profile management
│   ├── menu/page.tsx            # Catering Menu packages management
│   ├── menu-items/page.tsx      # Dishes catalog with filtering and search
│   └── feedback/page.tsx        # Customer ratings and feedback analytics
├── components/
│   ├── ui/                      # Reusable atom components (button, input, card, badge, modal, select, etc.)
│   ├── layout/                  # Navigation bar, sidebar, dashboard-layout, theme/language toggles
│   └── shared/                  # EmptyState, ConfirmModal, StatCard
├── context/
│   ├── theme-context.tsx        # Theme state provider & persistence
│   ├── language-context.tsx     # i18n locale state provider & translator
│   └── auth-context.tsx         # User & Vendor authentication session
├── providers/
│   ├── query-provider.tsx       # TanStack Query client provider
│   └── app-providers.tsx        # Aggregated providers wrapper
├── services/
│   ├── api-client.ts            # Centralized Axios client with Bearer & 401 refresh interceptors
│   ├── api-error.ts             # Standardized operational error class
│   ├── auth.service.ts          # Auth REST calls
│   ├── business.service.ts      # Business profile REST calls
│   ├── menu.service.ts          # Menus REST calls
│   ├── menu-item.service.ts     # Menu items REST calls
│   ├── review.service.ts        # Reviews & rating REST calls
│   └── vendor.service.ts        # Vendor metrics & profile REST calls
├── types/                       # Strict TypeScript interfaces matching backend models
└── lib/
    └── utils.ts                 # Styling (cn) and Indian currency (₹) / date formatters
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** `>= 18.0.0` (Node 20+ recommended)
- **Prasang Server** running locally at `http://localhost:5001` (or your staging backend URL)

### 1. Installation
```bash
cd prasang-vendor
npm install
```

### 2. Environment Setup
Create a `.env.local` file:
```bash
cp .env.example .env.local
```

Ensure `NEXT_PUBLIC_API_URL` points to your active `prasang-server` endpoint:
```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api/v1
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts local Next.js development server with hot-reloading |
| `npm run build` | Compiles optimized production bundle with strict TypeScript checking |
| `npm run start` | Runs the compiled Next.js production server |
| `npm run lint` | Runs ESLint analysis across all components and pages |

---

## 🛡️ Production & Quality Verification

- **Strict Type Checking**: Zero TypeScript `any` compromises or compilation errors.
- **Lint Clean**: Passes `npm run lint` with 0 errors and 0 warnings.
- **Production Build**: Verified with Next.js Turbopack compiler (`npm run build`).
- **Responsive**: Fully responsive across mobile, tablet, and desktop viewports.
