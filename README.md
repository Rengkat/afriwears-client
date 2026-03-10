# AfriWears — African Fashion Marketplace (Client)

AfriWears is a multi-role African fashion marketplace built with **Next.js 15** and **TypeScript**. The platform connects customers who love African fashion with talented stylists who create and sell it, all under the oversight of an admin team that ensures quality and trust across the marketplace.

---

## Table of Contents

- [Overview](#overview)
- [User Roles](#user-roles)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Features by Role](#features-by-role)
  - [Customer (User)](#customer-user)
  - [Stylist](#stylist)
  - [Admin](#admin)
- [Authentication & Security](#authentication--security)
- [State Management](#state-management)
- [Real-Time Features](#real-time-features)
- [API Integration](#api-integration)
- [Routing & Middleware](#routing--middleware)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)

---

## Overview

AfriWears provides a seamless shopping and selling experience for African traditional and contemporary fashion. Stylists can list products and fulfil orders, customers can browse, wishlist, and purchase items via standard or custom orders, and admins maintain control over product approvals, stylist verification, and platform-wide settings.

---

## User Roles

| Role | Description |
|------|-------------|
| **Customer (`user`)** | Browses and purchases products, places standard or custom orders, manages their cart, wishlist, addresses, and wallet |
| **Stylist** | Operates a fashion brand on the platform — submits products for admin approval, manages their product catalogue, and fulfils customer orders |
| **Admin** | Has full oversight — approves or rejects products and stylist accounts, manages users, transactions, orders, and platform-wide settings |

---

## Tech Stack

| Technology | Purpose |
|---|---|
| [Next.js 15](https://nextjs.org/) | React framework with App Router and Turbopack |
| [React 19](https://react.dev/) | UI library |
| [TypeScript 5](https://www.typescriptlang.org/) | Static typing |
| [Redux Toolkit](https://redux-toolkit.js.org/) | Global state management |
| [RTK Query](https://redux-toolkit.js.org/rtk-query/overview) | API data fetching, caching, and cache invalidation |
| [Socket.IO Client](https://socket.io/docs/v4/client-api/) | Real-time messaging and notifications |
| [Tailwind CSS 4](https://tailwindcss.com/) | Utility-first styling |
| [MUI (Material UI)](https://mui.com/) | Component library |
| [Framer Motion](https://www.framer.com/motion/) | Animations and transitions |
| [Swiper](https://swiperjs.com/) | Image carousels and sliders |
| [React Hot Toast](https://react-hot-toast.com/) | Toast notifications |
| [React Icons](https://react-icons.github.io/react-icons/) | Icon library |
| [date-fns](https://date-fns.org/) | Date formatting utilities |
| [Lodash](https://lodash.com/) | Utility functions (debounce, etc.) |
| [Cloudinary](https://cloudinary.com/) | Image hosting and delivery |

---

## Project Structure

```
src/
├── app/
│   ├── (Auth)/                         # Auth pages (login, register, forgot password, etc.)
│   │   ├── login/
│   │   ├── register/
│   │   │   └── stylist/                # Stylist-specific registration
│   │   ├── forgot-password/
│   │   ├── reset-password/
│   │   └── auth/
│   │       ├── verify-email/
│   │       └── reset-password/
│   │
│   └── (Public)/
│       ├── page.tsx                    # Homepage
│       ├── products/                   # Product listing and detail pages
│       │   └── [id]/                   # Individual product page with measurement form
│       ├── stylists/                   # Stylist directory and individual profiles
│       │   └── [stylistId]/
│       │
│       └── (Protected)/               # Routes requiring authentication
│           ├── cart/                   # Shopping cart
│           ├── orders/                 # Customer order history and detail
│           ├── chats/                  # Real-time messaging
│           ├── notifications/          # Notification centre
│           └── account/
│               ├── user/               # Customer dashboard
│               │   ├── checkout/
│               │   ├── address/
│               │   ├── orders/
│               │   ├── wishlist/
│               │   ├── transactions/
│               │   └── edit-profile/
│               │
│               ├── stylist/            # Stylist dashboard
│               │   ├── products/
│               │   │   ├── add-product/
│               │   │   └── [id]/
│               │   ├── profile/
│               │   └── settings/
│               │
│               └── admin/              # Admin dashboard
│                   ├── products/       # Product approval queue
│                   ├── orders/         # Platform-wide order management
│                   ├── users/          # Customer management
│                   ├── stylists/       # Stylist verification and management
│                   ├── transactions/   # Transaction oversight
│                   ├── profile/
│                   └── settings/
│
├── components/                         # Shared UI components
│   ├── Nav.tsx / MobileNav.tsx
│   ├── Hero.tsx / SubHero.tsx
│   ├── Footer.tsx
│   ├── ProductCard.tsx / ProductGallery.tsx
│   ├── StylistCard.tsx
│   ├── ReviewsSection.tsx
│   ├── Skeleton.tsx
│   └── ...
│
├── redux/
│   ├── Store.tsx                       # Redux store configuration
│   ├── BaseUrl.tsx                     # Axios base query with token refresh logic
│   ├── Provider.tsx / CartProvider.tsx
│   ├── SocketContext.tsx
│   ├── features/
│   │   ├── authSlice.tsx               # Auth state (user, token, isAuthenticated)
│   │   ├── cartSlice.tsx               # Local cart state
│   │   └── appSlice.tsx                # Global UI state
│   └── services/
│       ├── AuthApiSlice.tsx            # Auth endpoints (login, register, logout, etc.)
│       ├── ProductApi.tsx              # Product CRUD endpoints
│       ├── OrderApiSlice.tsx           # Order creation and management
│       ├── CartApiSlice.tsx            # Cart sync with backend
│       ├── WishlistApiSlice.tsx        # Wishlist management
│       ├── TransactionApiSlice.tsx     # Payment and transaction history
│       ├── UserApiSlice.tsx            # User profile management
│       ├── StylistApiSlice.tsx         # Stylist management
│       ├── NotificationApiSlice.tsx    # Notification fetching
│       └── MessageApiSlice.tsx         # Chat messages
│
├── Utils/
│   ├── Types.tsx                       # Shared TypeScript interfaces
│   ├── utils.tsx                       # Helper utilities
│   ├── colorPilatte.tsx                # Colour palette data
│   ├── cartSync.tsx                    # Cart synchronisation logic
│   ├── mockData.tsx                    # Dev/test mock data
│   └── socket.tsx                      # Socket.IO context provider
│
└── middleware.ts                       # Next.js route protection middleware
```

---

## Features by Role

### Customer (User)

- **Browse Products** — Filter and sort the product catalogue by category (`men`, `women`, `unisex`, `material`), type (`native`, `corporate`, `casual`, `traditional`), price range, and stylist.
- **Product Detail** — View product images, descriptions, materials, care instructions, delivery info, attributes (colours, sizes), and customer reviews.
- **Standard & Custom Orders** — Place a standard order or a custom order that includes body measurements and material samples.
- **Shopping Cart** — Add, update, and remove items; cart state syncs between local Redux state and the backend.
- **Checkout** — Choose a shipping address and payment method, including wallet-based payment.
- **Wallet** — Fund and manage an in-platform wallet for seamless purchases.
- **Wishlist** — Save products for later and manage a personal wishlist.
- **Order Tracking** — View order history with detailed status (`pending`, `processing`, `shipped`, `delivered`, `cancelled`).
- **Address Book** — Save, edit, and manage multiple shipping addresses.
- **Transactions** — View a history of all payments and verify payment status via Paystack.
- **Stylist Directory** — Browse and view individual stylist profiles and their product collections.
- **Real-Time Chat** — Message stylists directly through the in-platform chat.
- **Notifications** — Receive real-time platform notifications.

---

### Stylist

- **Stylist Registration** — Separate registration flow at `/register/stylist` with portfolio and verification details.
- **Product Management** — Add, edit, and delete products; products enter a `pending` state and must be approved by an admin before appearing on the storefront.
- **Product Attributes** — Configure colours (name + hex code), sizes, materials, care instructions, and delivery info per product.
- **Product Flags** — Mark products as `isBestSeller`, `isNewProduct`, or `featured`.
- **Product Status Tracking** — View the approval status of all submitted products (`pending`, `approved`, `rejected`) along with any rejection reason from the admin.
- **Order Fulfilment** — View and manage orders assigned to their brand.
- **Profile & Portfolio** — Maintain a public-facing profile with a portfolio section and verification status.
- **Settings** — Manage account preferences.

---

### Admin

- **Product Approval** — Review all submitted products in a queue; approve or reject with a written rejection reason.
- **Stylist Management** — Verify, suspend, or remove stylist accounts; view detailed stylist profiles and filter by status.
- **User Management** — View, filter, suspend, or remove customer accounts.
- **Order Management** — View all platform orders with full detail, search and filter by status, and update order status.
- **Transaction Oversight** — View all financial transactions across the platform with filter and search.
- **Dashboard Stats** — High-level stat cards across products, users, stylists, orders, and transactions.
- **Platform Settings** — Manage general settings, notifications, payment configuration, security, and user roles.
- **Profile Management** — Update admin profile, avatar, notification preferences, and security settings.

---

## Authentication & Security

AfriWears uses a **cookie-based JWT authentication** system with automatic token refresh.

- **Access Token** — Short-lived JWT stored in an `httpOnly` cookie.
- **Refresh Token** — Longer-lived token used to silently renew the access token on expiry.
- **Token Refresh Flow** — Implemented in `BaseUrl.tsx`, the RTK Query base query automatically intercepts `401` responses and attempts a token refresh before retrying the original request. If the refresh fails, the user is logged out and redirected to login.
- **Rate Limiting** — The base query includes a 60-second backoff when a `429 Too Many Requests` response is received.
- **Session Expiry** — If tokens are present but invalid, users are redirected to `/login?session=expired`.
- **Route Protection** — The Next.js middleware (`middleware.ts`) validates tokens server-side by calling the backend `auth/validate-tokens` endpoint before allowing access to protected routes.

### Public vs. Protected Routes

| Route Type | Examples |
|---|---|
| **Public** | `/`, `/products`, `/stylists`, `/login`, `/register`, `/forgot-password` |
| **Protected (Auth Required)** | `/cart`, `/orders`, `/chats`, `/notifications`, `/account/*` |
| **Auth Redirect (Blocked if Logged In)** | `/login`, `/register`, `/forgot-password` |

---

## State Management

The Redux store is configured in `Store.tsx` with the following slices:

| Slice / API | Responsibility |
|---|---|
| `authSlice` | Current user object, token, and `isAuthenticated` flag |
| `cartSlice` | Local cart item state |
| `appSlice` | Global UI state (e.g. modal visibility, filters) |
| `authApi` | Auth API mutations (login, register, logout, refresh, profile) |
| `productApi` | Product queries and mutations |
| `orderApi` | Order creation, listing, and status updates |
| `cartApi` | Backend cart synchronisation |
| `wishlistApi` | Wishlist add/remove/list |
| `transactionApi` | Transaction history and payment verification |
| `userApiSlice` | User profile updates |
| `stylistApi` | Stylist listing, detail, admin management |
| `notificationApi` | In-app notifications |
| `messageApi` | Chat messages |

RTK Query handles caching, background refetching, and cache invalidation automatically via tag-based invalidation.

---

## Real-Time Features

Real-time functionality is powered by **Socket.IO**, managed through the `SocketProvider` context (`Utils/socket.tsx`).

- **Authentication** — Sockets are authenticated using the access token from cookies.
- **User Rooms** — Each authenticated user automatically joins a personal room (`userId`).
- **Admin Room** — Admin users additionally join a shared `admin_room` for platform-wide events.
- **Reconnection** — The socket client is configured with automatic reconnection (up to 5 attempts with a 1-second delay).
- **Features** — Live chat between customers and stylists, real-time notifications for order updates, product approvals, and system events.

---

## API Integration

The backend API base URL defaults to `http://localhost:5000/api` and is configurable via the `NEXT_PUBLIC_BACKEND_URL` environment variable.

Key API resource groups:

| Resource | Endpoints |
|---|---|
| Auth | `register`, `login`, `logout`, `refresh-token`, `validate-tokens`, `forgot-password`, `reset-password`, `verify-email` |
| Products | `GET /products`, `GET /products/:id`, `POST /products`, `PATCH /products/:id`, `DELETE /products/:id`, `GET /products/my-products`, `GET /products/all-products-admin` |
| Orders | Create, list, detail, update status |
| Cart | Sync, add, update, remove, clear |
| Wishlist | Add, remove, list |
| Transactions | List, verify payment |
| Users | Profile, update, address management |
| Stylists | List, detail, admin verification/suspension |
| Notifications | List, mark as read |
| Messages | Send, list conversations |

Image assets are served from **Cloudinary** (`res.cloudinary.com`), configured in `next.config.ts`.

---

## Routing & Middleware

The project uses the **Next.js App Router** with route groups to organise public, auth, and protected sections cleanly:

- `(Auth)` — Unauthenticated-only pages (login, register, etc.)
- `(Public)` — Pages accessible by everyone
- `(Public)/(Protected)` — Pages that require a valid session

The custom Next.js middleware (`src/middleware.ts`) runs on every non-static request and:
1. Calls the backend to validate the user's tokens.
2. Redirects unauthenticated users away from protected routes to `/login`.
3. Redirects authenticated users away from auth pages to the homepage.
4. Returns a `401` JSON response for unauthenticated API route access.

---

## Getting Started

### Prerequisites

- Node.js `>= 18`
- npm or yarn
- A running instance of the [AfriWears backend API](https://afrikan-wears-backend.onrender.com)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd Afriwears-client

# Install dependencies
npm install
```

### Running Locally

```bash
# Start the development server with Turbopack
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

### Other Scripts

```bash
# Build for production
npm run build

# Start the production server
npm start

# Lint the codebase
npm run lint
```

---

## Environment Variables

Create a `.env.local` file in the root of the project with the following variables:

```env
# Backend REST API base URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000/api

# Socket.IO server URL (can be the same host as the API)
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

For production, update these to point to your deployed backend (e.g. `https://afrikan-wears-backend.onrender.com/api`).

---

## Deployment

The project is configured for deployment on **Netlify** via the `@netlify/plugin-nextjs` plugin.

Ensure the following before deploying:
- All environment variables are set in the Netlify dashboard.
- The backend API and socket server are live and accessible.
- `next.config.ts` `remotePatterns` includes the correct image domains for your environment.

---

## Key Data Models

### Product

```ts
{
  name, description, price, minPrice, maxPrice,
  category: "men" | "women" | "unisex" | "material",
  type: "native" | "corporate" | "casual" | "traditional",
  status: "pending" | "approved" | "rejected",
  attributes: { colors, sizes, material },
  isBestSeller, isNewProduct, featured,
  mainImage, subImages,
  careInstructions, deliveryInfo,
  stylist, stylistName,
  rating, reviews, reviewCount, stock
}
```

### Order

```ts
{
  orderItems: [{ product, quantity, priceAtPurchase, orderType, measurements, status }],
  shippingAddress: { country, state, city, street, postalCode, homeAddress, phone },
  paymentInfo: { paymentMethod, paymentStatus, amountPaid, balanceDue },
  orderStatus: "pending" | "processing" | "shipped" | "delivered" | "cancelled",
  isCustomOrder, paidPercentage, awaitingBalancePayment
}
```

---

*Built with ❤️ for African fashion.*
