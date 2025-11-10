# React Authentication with JWT (Access + Refresh Tokens)

A complete React authentication system implementing JWT-based authentication with access and refresh tokens, built with modern best practices and the latest technologies.

## 🚀 Live Demo

**Deployment URL:** [Your Vercel Deployment URL Here]

> **Note:** Replace the above placeholder with your actual Vercel deployment URL after deploying.

## ✨ Features

- ✅ **Secure JWT Authentication** - Access and refresh token pattern
- ✅ **Automatic Token Refresh** - Seamless token refresh using Axios interceptors
- ✅ **Protected Routes** - Route guards for authenticated users only
- ✅ **Form Validation** - React Hook Form with comprehensive validation
- ✅ **State Management** - React Query for server state management
- ✅ **Mock API** - MSW (Mock Service Worker) for development and demo
- ✅ **Modern UI** - Tailwind CSS 4 with responsive design
- ✅ **TypeScript** - Full type safety
- ✅ **Error Handling** - Comprehensive error handling and user feedback
- ✅ **React 19** - Latest React with React Compiler

### 🌟 Stretch Goals (Bonus Features)

- ✅ **Silent Token Refresh** - Automatic token refresh before expiration (13-minute interval)
- ✅ **Cookie-Based Storage** - Secure cookie storage for refresh tokens (SameSite strict, secure flag)
- ✅ **Multi-Tab Synchronization** - Cross-tab authentication sync using storage events
- ✅ **Role-Based Access Control** - Admin, user, and moderator roles with protected routes

## 🛠️ Tech Stack

- **React 19.2** - Latest React with React Compiler for optimization
- **TypeScript** - Type safety and better developer experience
- **Vite** - Lightning-fast build tool
- **Tailwind CSS 4.1.17** - Modern utility-first CSS framework
- **React Router DOM 7** - Client-side routing
- **React Query (TanStack Query)** - Server state management
- **React Hook Form 7.66** - Form handling and validation
- **Axios** - HTTP client with interceptors
- **MSW (Mock Service Worker)** - API mocking for development

## 📋 Prerequisites

- Node.js 22+
- pnpm (recommended) or npm

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd react-authentication
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Configuration

The project comes with pre-configured environment files:

- `.env.development` - Development environment
- `.env.production` - Production environment

**For Mock API (Default):**
No changes needed. The app uses MSW to simulate backend API.

**For Real Backend API:**
Update the environment files:

```env
VITE_API_BASE_URL=https://your-backend-api.com/api
VITE_USE_MOCK_API=false
```

### 4. Run Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:5173`

### 5. Build for Production

```bash
pnpm build
```

### 6. Preview Production Build

```bash
pnpm preview
```

## 🔐 Demo Credentials

Use these credentials to test the application:

- **Admin User:**

  - Email: `admin@example.com`
  - Password: `admin123`
  - Role: `admin` (can access Admin Panel)

- **Regular User:**

  - Email: `user@example.com`
  - Password: `user123`
  - Role: `user` (standard access)

- **Demo User:**
  - Email: `demo@example.com`
  - Password: `demo123`
  - Role: `user` (standard access)

## 📁 Project Structure

```text
src/
├── api/              # API client and authentication
│   ├── client.ts     # Axios instance with interceptors
│   └── auth.ts       # Authentication API functions
├── components/       # Reusable components
│   ├── ProtectedRoute.tsx
│   └── RoleBasedRoute.tsx
├── context/          # React Context
│   └── AuthContext.tsx
├── hooks/            # Custom hooks
│   └── useAuthQuery.ts
├── mocks/            # MSW mock API
│   ├── browser.ts
│   └── handlers.ts
├── pages/            # Pages
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   └── AdminPage.tsx
├── types/            # TypeScript types
│   └── auth.ts
├── utils/            # Utilities
│   ├── tokenStorage.ts
│   ├── cookies.ts
│   └── tokenRefreshScheduler.ts
├── App.tsx
├── main.tsx
└── index.css
```

## 🔑 Authentication Flow

### Authentication Process

1. User submits credentials via React Hook Form
2. Server returns access and refresh tokens
3. Access token stored in memory, refresh token in secure cookies
4. User redirected to dashboard

### Token Management

- **Access Token:**

  - Stored in memory (not in cookies/localStorage for security)
  - Expires in 15 minutes
  - Automatically attached to API requests via Axios interceptor
  - Silently refreshed 2 minutes before expiration

- **Refresh Token:**

  - Stored in secure cookies (SameSite strict, secure flag)
  - Expires in 7 days
  - Used to obtain new access tokens
  - Automatically broadcast to other tabs via storage events

### Token Refresh

- **Automatic**: Axios interceptor catches 401 errors and refreshes tokens
- **Proactive**: Silent refresh every 13 minutes (before 15-min expiry)
- **Multi-tab**: Logout in one tab logs out all tabs

## 🌟 Bonus Features (Stretch Goals)

### Silent Token Refresh

Proactively refreshes tokens every 13 minutes (before 15-min expiry) to prevent unexpected logouts.

### Cookie-Based Storage

Refresh tokens stored in secure cookies with `SameSite=Strict` and `Secure` flags for enhanced security.

### Multi-Tab Synchronization

Authentication state synced across all browser tabs using storage events. Logout in one tab logs out all tabs.

### Role-Based Access Control

Three user roles (`admin`, `user`, `moderator`) with protected routes. Admin-only `/admin` panel included.

## 🌐 Deployment

### Vercel (Recommended)

```bash
# Install and login
pnpm add -g vercel
vercel login

# Deploy
vercel --prod
```

Set environment variables in Vercel dashboard:

- `VITE_API_BASE_URL`
- `VITE_USE_MOCK_API`

### Netlify

```bash
pnpm build
# Deploy dist/ folder via Netlify UI or CLI
```

## 🧪 Testing

### Basic Flow

1. Navigate to home page
2. Login with demo credentials
3. View dashboard with user info
4. Test logout functionality

### Bonus Features

- **Silent Refresh**: Watch console for auto-refresh logs every 13 minutes
- **Cookie Storage**: Check DevTools → Application → Cookies for `refreshToken`
- **Multi-Tab Sync**: Open two tabs, logout in one, observe both logout
- **RBAC**: Login as admin to access `/admin`, login as user to see access denied

## � Troubleshooting

- **MSW not working**: Check console for initialization messages, verify `VITE_USE_MOCK_API=true`
- **Token refresh failing**: Check console logs, verify refresh token in cookies
- **Protected routes not working**: Verify tokens are set, check AuthContext state

## 🎯 Assignment Completion Checklist

### Core Requirements

- ✅ Authentication flow with login and logout
- ✅ Access and refresh token implementation
- ✅ Axios configuration with interceptors
- ✅ React Query integration
- ✅ React Hook Form integration
- ✅ Protected routes implementation
- ✅ User interface with login, logout, and dashboard
- ✅ Public hosting (Vercel ready)
- ✅ Error handling
- ✅ Mock API backend with MSW
- ✅ Clean code organization
- ✅ TypeScript type safety
- ✅ Modern best practices

### Stretch Goals (Bonus)

- ✅ Silent token refresh before expiration
- ✅ Cookie-based refresh token storage
- ✅ Multi-tab authentication synchronization
- ✅ Role-based access control (RBAC)

---

**Deployment URL:** [Insert your Vercel URL here after deployment]
