#  Tech-Store: High-Performance E-Commerce Experience

[![Next.js](https://img.shields.io/badge/Next.js-16.2.0-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-blue?logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-47A248?logo=mongodb)](https://www.mongodb.com/)
[![Redux](https://img.shields.io/badge/Redux_Toolkit-2.11.2-764ABC?logo=redux)](https://redux-toolkit.js.org/)

**Tech-Store** is a premium, high-fidelity e-commerce platform designed for modern consumers. It combines cutting-edge technology with a sleek, minimalist aesthetic to provide a seamless shopping experience for innovative tech gadgets.

---

## Key Features & Functionalities

### 🎨 Premium UI/UX & Design Philosophy
- **Glassmorphism Design**: Modern, translucent interfaces that feel light and premium.
- **Tech Inspired Layout**: Professional, high-conversion design with primary green accents and optimized product density.
- **Fluid Animations**: Smooth transitions and interactive elements powered by **Framer Motion** and **Lenis Scroll**.
- **Responsive Navigation**: Mobile-optimized navbar with persistent search, compact action buttons, and intuitive mobile drawer.
- **Dynamic Loading states**: Polished, responsive loading components to ensure a seamless transition between pages.
- **Custom 404 Experience**: Dedicated, animated error page for a superior brand experience even during broken links.

### 🛍️ Core Shopping Experience
- **Interactive Product Details**: Immersive product pages with quantity selectors, technical specification tables, and metadata chips.
- **Dynamic Category Management**: Real-time category synchronization directly from the product database.
- **Advanced Filtering & Search**: Instant filtering by category, search terms, and pricing.
- **Verified Review System**: Robust rating and review mechanism with user identity verification.
- **Cart & Wishlist Logic**: Persistent state management for a seamless "save for later" and checkout flow.

### ⚙️ Global Site Customization
- **Dynamic Hero Section**: Administrators can update the badge, headline, description, and hero image directly from the dashboard.
- **Centralized Settings Catalog**: Manage site name, contact details, site logo, and global descriptions via the administrative suite.
- **Responsive Branding**: Real-time updates to brand colors and metadata reflected across the entire application.

### 💳 Integrated Payment Ecosystem
- **Stripe Integration**: Secure and seamless credit/debit card processing.
- **Manual Payment System (MFS)**: Support for local gateways (bKash, Nagad, Rocket) with a **Strict Transaction ID Verification** workflow.
- **Dynamic Payment UI**: Context-aware payment screens that adapt based on the selected gateway.

### 🛡️ Smart Access & Advanced Security
- **Role-Based Access Control (RBAC)**: Fine-grained permissions for **Super Admin**, **Admin**, and **Manager** roles.
- **Secure Authentication**: Protected routes and multi-layered user sessions powered by **NextAuth.js**.
- **Google Site Verification**: Fully integrated for search console ownership and indexing.
- **Database Maintenance Routine**: Automated tools for cleaning up technical ID garbage and restoring relational integrity.

### 📈 SEO & Performance Optimization
- **Dynamic Sitemaps**: Automated `sitemap.xml` generation for optimal search engine crawling.
- **Robots.txt Management**: Standardized crawler instructions for better indexing control.
- **JSON-LD Structured Data**: High-fidelity schema markup for Products and Organizations to enhance Rich Snippets.
- **Next.js 16 Optimization**: Utilizing React Server Components and SSR for lightning-fast interactions and SEO dominance.

### 🛠️ Maintenance & Data Integrity
- **Legacy Category Cleanup**: Automated identification and removal of orphaned or "technical ID-based" categories to maintain a clean storefront catalog.
- **Relational Data Healing**: Intelligent migration scripts to link legacy product labels to official database references, ensuring normalized data integrity.
- **Human-Centric Documentation**: Refactored codebase to replace assistant-style placeholders with professional, human-readable documentation.


---

## Future Roadmap

We are constantly evolving the platform. Here are the features currently in development:

- [x] **Payment Gateway Integration**: Seamless checkout with Stripe and local MFS (bKash/Nagad/Rocket).
- [x] **SEO Optimization**: Complete sitemap, robots.txt, and JSON-LD integration.
- [x] **Dynamic Hero Management**: Full administrator control over homepage visuals.
- [ ] **AI-Powered Recommendations**: Personalized product suggestions based on user browsing history and preferences.
- [ ] **Real-time Order Tracking**: Interactive dashboard for users to track their order status in real-time.
- [ ] **Multi-language Support**: Deep localization supporting both **English** and **Bengali (BN)**.
- [ ] **Advanced Analytics Dashboard**: Enhanced sales visualization and business intelligence for administrators.
- [ ] **Progressive Web App (PWA)**: Enabling offline access and home screen installation for mobile users.

---

## 💻 Tech Stack

| Category | Technology |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Frontend** | React 19, Tailwind CSS 4 |
| **State Management** | Redux Toolkit |
| **Database** | MongoDB with Mongoose |
| **Payments** | Stripe, Manual Payment (MFS) |
| **Animations** | Framer Motion, Lenis Scroll |
| **SEO** | Next-Sitemap, JSON-LD |
| **Icons** | Lucide React |
| **Authentication** | NextAuth.js |

---

## 📂 Project Structure

```text
Tech-Store/
├── app/                        # Next.js App Router (Core Application)
│   ├── (main)/                 # Main User-Facing Routes (Home, Products, ID)
│   │   ├── cart/               # Shopping Cart & Management
│   │   ├── checkout/           # Secure Checkout & Payment Flow
│   │   ├── product/            # Immersive Product Detail Pages
│   │   ├── products/           # Advanced Product Listing & Filtering
│   │   ├── login/              # User Authentication (Sign In)
│   │   ├── register/           # User Authentication (Sign Up)
│   │   ├── privacy/            # Professional Privacy Policy
│   │   ├── terms/              # Terms of Service Documentation
│   │   └── cookies/            # Cookie Policy & Compliance
│   ├── api/                    # Backend API Route Handlers (Server-Side)
│   │   ├── auth/               # Authentication Logic & Registration
│   │   ├── products/           # Inventory Management API
│   │   ├── orders/             # Order Lifecycle & Status Management
│   │   ├── payment/            # Stripe Integration (Intent Creation)
│   │   ├── seed-categories/    # Data Integrity & Category Restoration
│   │   └── webhook/            # Payment Gateway Webhooks (Stripe)
│   ├── dashboard/              # Comprehensive Administrative Panel
│   ├── layout.tsx              # Root Layout & Provider Initialization
│   └── globals.css             # Global Styles & Tailwind Design Tokens
├── components/                 # Reusable React UI Components
│   ├── Sections/               # Modular Page Blocks (Hero, Features, Catalog)
│   ├── Checkout/               # Payment-Specific UI (Stripe/MFS Forms)
│   ├── dashboard/              # Admin-Specific UI Components
│   ├── Navbar.tsx             # Dynamic Navigation System
│   └── Footer.tsx             # Information-Rich Site Footer
├── lib/                        # Infrastructure & Utility Layer
│   └── db.ts                   # Robust Mongoose Connection Logic
├── models/                     # Data Architecture (Mongoose Models)
│   ├── Product.ts             # Product Catalog Schema
│   ├── Order.ts               # Transaction & Logistics Schema
│   ├── User.ts                # Secure User Profile Schema
│   └── Settings.ts            # Global Site Configuration Schema
├── public/                     # Static Optimized Assets
│   └── images/                 # Optimized UI Icons & Graphics
├── redux/                      # Global Reactive State Management
│   ├── slices/                 # Feature-Specific State Logic (Cart, Auth, UI)
│   └── store.ts                # Centralized Redux Store Configuration
├── types/                      # Comprehensive TypeScript Interfaces
└── next.config.js              # Advanced Framework Configuration
```

---

## 🌐 API Endpoints

### **Authentication**
- `POST /api/auth/register` - Create a new user account.
- `POST /api/auth/login` - Authenticate users with credentials (handled via NextAuth).

### **User Profile**
- `PUT /api/user/profile` - Update user profile information (name, image, password). (Requires authentication).

### **Products**
- `GET /api/products` - Fetch a paginated list of products. Supports `category`, `search`, `page`, and `limit` query parameters.
- `POST /api/products` - Create a new product. (Restricted to **Admin/Manager**).
- `GET /api/products/{id}` - Retrieve detailed information for a specific product.
- `PATCH /api/products/{id}` - Update existing product details. (Restricted to **Admin/Manager**).
- `DELETE /api/products/{id}` - Permanently remove a product. (Restricted to **Super Admin/Admin**).

### **Reviews**
- `POST /api/products/{id}/reviews` - Submit a customer review (rating and comment) for a specific product. (Requires authentication).

### **Orders**
- `GET /api/orders` - List all orders (Admin/Manager) or specific orders for the authenticated user.
- `POST /api/orders` - Create a new order (Supports guest and authenticated checkouts).
- `GET /api/orders/{id}` - Fetch detailed information for a specific order.
- `PATCH /api/orders/{id}` - Update order status or transaction details. (Admin restricted for status changes).

### **Categories & Settings**
- `GET /api/categories` - Fetch a unique list of all product categories.
- `GET /api/settings` - Retrieve global application settings (e.g., Contact info, MFS numbers, Hero configurations).

### **Maintenance & Setup**
- `GET /api/seed` - Initialize the database with primary dummy products (Development only).
- `GET /api/seed-categories` - Restore database integrity, clean up technical ID categories, and sync product labels.

### **Payment Gateways**
- `POST /api/payment/create-intent` - Generate a Stripe Payment Intent for secure card transactions.
- `POST /api/webhook/stripe` - Handle asynchronous payment events from Stripe.

---

##  Getting Started

### Prerequisites
- Node.js (Latest LTS version)
- MongoDB (Local instance or Atlas connection)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/amdadislam01/Tech-Store.git
   cd Tech-Store
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root directory and add your configurations:
   ```env
   # Database & Auth
   MONGODB_URI=your_mongodb_connection_string
   NEXTAUTH_SECRET=your_secret_key
   NEXTAUTH_URL=http://localhost:3000

   # Payment Gateway (Stripe)
   STRIPE_SECRET_KEY=your_stripe_secret_key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

   # Image Hosting (ImgBB)
   NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_api_key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Visit the app:**
   Open [http://localhost:3000](http://localhost:3000) in your browser.

