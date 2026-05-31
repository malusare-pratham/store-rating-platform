# RateStore — Premium Store Rating Platform

A production-grade full-stack web application built with React, Node.js, Express, and MySQL.

---

## 🗂 Project Structure

```
store-rating-platform/
├── backend/
│   ├── config/
│   │   ├── db.js              # MySQL connection pool
│   │   └── schema.sql         # Full DB schema + seed admin
│   ├── controllers/
│   │   ├── authController.js  # signup, login, me, updatePassword
│   │   ├── adminController.js # dashboard, users CRUD, stores CRUD
│   │   └── storeController.js # browse stores, submit rating, owner dashboard
│   ├── middleware/
│   │   ├── authMiddleware.js  # JWT verification
│   │   ├── roleMiddleware.js  # Role-based access (admin/user/store_owner)
│   │   ├── validateMiddleware.js # express-validator error handler
│   │   └── errorMiddleware.js # Global error + 404 handler
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── adminRoutes.js
│   │   └── storeRoutes.js
│   ├── utils/
│   │   └── response.js        # Standardised API response helpers
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── layout/
    │   │   │   ├── DashboardLayout.jsx  # Sidebar + header wrapper
    │   │   │   ├── Sidebar.jsx          # Collapsible sidebar + mobile drawer
    │   │   │   └── ProtectedRoute.jsx   # Auth + role guard
    │   │   └── ui/
    │   │       ├── Badge.jsx            # RoleBadge, StatusBadge
    │   │       ├── EmptyState.jsx       # Empty placeholder with icon
    │   │       ├── LoadingSpinner.jsx   # Spinner, PageLoader, Skeleton*
    │   │       ├── Modal.jsx            # Animated modal system
    │   │       ├── SortableTable.jsx    # ThSort header + Pagination
    │   │       └── StarRating.jsx       # StarDisplay + interactive StarInput
    │   ├── contexts/
    │   │   └── AuthContext.jsx          # Global auth state
    │   ├── hooks/
    │   │   └── useDebounce.js           # Debounced search hook
    │   ├── pages/
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── Settings.jsx             # Profile + change password
    │   │   ├── admin/
    │   │   │   ├── AdminDashboard.jsx   # Stats + radial chart + quick actions
    │   │   │   ├── UsersList.jsx        # Searchable, sortable, paginated table
    │   │   │   ├── StoresList.jsx       # Searchable, sortable, paginated table
    │   │   │   ├── AddUser.jsx          # Validated form with role select
    │   │   │   └── AddStore.jsx         # Validated form with owner dropdown
    │   │   ├── user/
    │   │   │   └── UserDashboard.jsx    # Store grid with rating modal
    │   │   └── owner/
    │   │       └── OwnerDashboard.jsx   # Rating distribution + raters table
    │   ├── services/
    │   │   └── api.js                   # Axios instance with interceptors
    │   ├── utils/
    │   │   └── validation.js            # Yup schemas for all forms
    │   ├── App.jsx                      # Router with protected routes
    │   ├── main.jsx                     # Entry point + Toaster
    │   └── index.css                    # Tailwind + design system
    ├── index.html
    ├── package.json
    ├── tailwind.config.js
    ├── postcss.config.js
    └── vite.config.js
```

---

## ⚙️ Setup Guide

### 1. Database Setup

```sql
-- Run in MySQL client:
CREATE DATABASE store_rating_app;
USE store_rating_app;
-- Then paste the contents of backend/config/schema.sql
```

Or run directly:
```bash
mysql -u root -p < backend/config/schema.sql
```

This creates the tables and seeds a default admin account:
- **Email:** `admin@storerating.com`
- **Password:** `Admin@123`

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your DB credentials and a strong JWT_SECRET
npm install
npm run dev
# Server starts on http://localhost:5000
```

**Environment Variables (`.env`):**
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=store_rating_app
JWT_SECRET=your_32_char_minimum_secret_key_here
JWT_EXPIRES_IN=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
# App starts on http://localhost:5173
```

---

## 🚀 Running the App

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

Open `http://localhost:5173` in your browser.

---

## 🔐 Roles & Access

| Role         | Access                                                       |
|--------------|--------------------------------------------------------------|
| `admin`      | Full dashboard, add/view users & stores, all filters         |
| `user`       | Browse stores, submit & modify ratings, update password      |
| `store_owner`| View own store stats, rating distribution, raters list       |

---

## 📋 API Endpoints

### Auth (`/api/auth`)
| Method | Endpoint              | Auth | Description         |
|--------|-----------------------|------|---------------------|
| POST   | `/signup`             | ✗    | Register new user   |
| POST   | `/login`              | ✗    | Login               |
| GET    | `/me`                 | ✓    | Get current user    |
| PUT    | `/update-password`    | ✓    | Change password     |

### Admin (`/api/admin`) — requires `admin` role
| Method | Endpoint         | Description                          |
|--------|------------------|--------------------------------------|
| GET    | `/dashboard`     | Stats: users, stores, ratings, avg   |
| GET    | `/users`         | List users (search, filter, sort, paginate) |
| GET    | `/users/:id`     | User detail (+ store if owner)       |
| POST   | `/users`         | Add user                             |
| GET    | `/stores`        | List stores (search, sort, paginate) |
| POST   | `/stores`        | Add store                            |

### Stores (`/api/stores`)
| Method | Endpoint              | Auth   | Description                  |
|--------|-----------------------|--------|------------------------------|
| GET    | `/`                   | user   | Browse stores (with user rating) |
| POST   | `/:id/rate`           | user   | Submit or update rating      |
| GET    | `/owner/dashboard`    | owner  | Owner dashboard data         |

---

## 🏗️ Production Build

```bash
# Build frontend
cd frontend && npm run build

# Start backend in production
cd backend && NODE_ENV=production npm start
```

Serve the `frontend/dist` folder via nginx or any static host.

---

## ✅ Assignment Requirements Checklist

- [x] Normal User signup & login
- [x] Admin: add users, add stores, view dashboard counts
- [x] Admin: list users with name/email/address/role + search/filter/sort
- [x] Admin: list stores with name/email/address/rating + search/sort
- [x] Admin: view user details (+ rating for store owners)
- [x] Admin: logout
- [x] Normal User: browse & search stores
- [x] Normal User: see overall rating + their own submitted rating
- [x] Normal User: submit rating (1–5)
- [x] Normal User: modify submitted rating
- [x] Normal User: update password
- [x] Normal User: logout
- [x] Store Owner: view users who rated their store
- [x] Store Owner: see average rating
- [x] Store Owner: update password
- [x] Store Owner: logout
- [x] Name validation: min 20, max 60 chars
- [x] Address validation: max 400 chars
- [x] Password: 8–16 chars, uppercase, special character
- [x] Email: standard validation
- [x] All tables: sorting (asc/desc) on key fields
- [x] JWT authentication
- [x] Role-based access control
- [x] Protected routes (frontend + backend)
- [x] Pagination on all tables
- [x] Debounced search
- [x] Toast notifications
- [x] Loading & empty states
- [x] Fully responsive (mobile/tablet/desktop)
- [x] MySQL with proper foreign keys & indexes
