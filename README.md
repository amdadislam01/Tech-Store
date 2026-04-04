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
- **Fluid Animations**: Smooth transitions and interactive elements powered by **Framer Motion**.
- **Responsive Layout**: Optimized for every device, from ultra-wide monitors to mobile screens.
- **Lucide Iconography**: Clean and consistent visual language across the entire platform.

### 🛍️ Core Shopping Experience
- **Dynamic Category Management**: Real-time category synchronization directly from the product database.
- **Advanced Filtering & Search**: Instant filtering by category, search terms, and pricing.
- **High-Fidelity Product Details**: Immersive product pages with interactive media galleries and detailed technical specifications.
- **Verified Review System**: Robust rating and review mechanism with user identity verification.
- **Cart & Wishlist Logic**: Persistent state management for a seamless "save for later" and checkout flow.

### 💳 Integrated Payment Ecosystem
- **Stripe Integration**: Secure and seamless credit/debit card processing.
- **Manual Payment System (MFS)**: Support for local gateways (bKash, Nagad, Rocket) with a **Strict Transaction ID Verification** workflow.
- **Dynamic Payment UI**: Context-aware payment screens that adapt based on the selected gateway.

### 🛡️ Smart Access & Advanced Security
- **Guest Access Management**: Integrated AI search quotas with a 3-free-search limit for guests.
- **Secure Authentication**: Protected routes and multi-layered user sessions powered by **NextAuth.js**.
- **Server-Side Route Protection**: Enhanced security for sensitive transactional pages like Cart and Checkout.

### 🛠️ Comprehensive Administrative Suite
- **Inventory Health Monitoring**: Real-time tracking of stock levels and automated catalog integrity checks.
- **Sales & Performance Metrics**: Data points for monitoring overall business performance and revenue.
- **Order Lifecycle Management**: Advanced filtering, status tracking, and end-to-end management for customer orders.

### 🚀 Performance & Infrastructure
- **Next.js 16 (App Router)**: Utilizing React Server Components and SSR for lightning-fast interactions.
- **Database Scalability**: Flexible and robust data modeling with **Mongoose** and **MongoDB**.
- **Edge-Ready Architecture**: Built for high availability and low-latency performance.

---

## Future Roadmap

We are constantly evolving the platform. Here are the features currently in development:

- [x] **Payment Gateway Integration**: Seamless checkout with Stripe and local MFS (bKash/Nagad/Rocket).
- [ ] **AI-Powered Recommendations**: Personalized product suggestions based on user browsing history and preferences.
- [ ] **Real-time Order Tracking**: Interactive dashboard for users to track their order status in real-time.
- [ ] **Multi-language Support**: Deep localization supporting both **English** and **Bengali (BN)**.
- [ ] **Advanced Analytics Dashboard**: Enhanced sales visualization and business intelligence for administrators.
- [ ] **Progressive Web App (PWA)**: Enabling offline access and home screen installation for mobile users.
- [ ] **Inventory Low-Stock Alerts**: Automated email/push notifications for administrators.

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
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **Authentication** | NextAuth.js |

---

## 📂 Project Structure

```text
Tech-Store/
├── app/                  # Next.js App Router routes
│   ├── (main)/           # User-facing pages (Home, Products, ID)
│   ├── api/              # Backend API endpoints
│   └── dashboard/        # Administrative dashboards
├── components/           # Reusable UI components
│   └── Sections/         # Modular page sections (Hero, Features, etc.)
├── lib/                  # Shared utilities and DB configuration
├── models/               # Mongoose database schemas
├── public/               # Static assets and images
├── redux/                # Global state management (Slices & Store)
├── types/                # Component and Model type definitions
└── globals.css           # Core design system and Tailwind themes
```

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

