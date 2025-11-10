# React Authentication with JWT (Access + Refresh)

A secure React single-page application implementing JWT authentication with access tokens and refresh tokens. Built with React 19, TypeScript, Tailwind CSS, React Query, React Hook Form, and Axios.

## 🌐 Live Demo

**Production URL:** [https://react-authentication-delta-pink.vercel.app/](https://react-authentication-delta-pink.vercel.app/)

## 🚀 Features

### Core Requirements ✅

- **Authentication Flow**: Complete login and logout mechanism
- **Token Management**:
  - Access tokens stored in memory (session only)
  - Refresh tokens stored in localStorage (persistent)
  - Automatic token cleanup on logout
- **Axios Configuration**:
  - Automatic token attachment to requests
  - 401 error handling with automatic token refresh
  - Seamless token refresh flow
- **React Query Integration**:
  - Mutations for login/logout
  - Queries for user data
  - Automatic query invalidation on auth state changes
- **React Hook Form**:
  - Form validation for login
  - Error handling and display
- **Protected Routes**: Route protection with automatic redirect to login
- **User Interface**:
  - Beautiful login page
  - Dashboard with user information
  - Logout functionality
- **Error Handling**: Comprehensive error messages for all scenarios
- **Public Hosting**: Ready for deployment on Vercel

### Stretch Goals ✅

- **Silent Token Refresh**: Tokens are refreshed automatically 2 minutes before expiration
- **Multi-tab Synchronization**: Logout and token updates sync across browser tabs
- **Role-based Access Control**: Implementation ready for role-based routes (Admin page included)
- **Mock API**: Built-in mock API for development and testing

## 🛠️ Tech Stack

- **React 19** - Latest React with React Compiler
- **TypeScript** - Type-safe development
- **Tailwind CSS 4** - Modern utility-first CSS
- **React Query (TanStack Query)** - Server state management
- **React Hook Form** - Form handling and validation
- **Axios** - HTTP client with interceptors
- **React Router** - Client-side routing
- **Vite** - Fast build tool and dev server

## 📦 Installation

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm/yarn

### Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd react-authentication
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Configure environment variables**

   Create `.env.development` for local development:

   ```env
   VITE_API_BASE_URL=http://localhost:3001/api
   VITE_USE_MOCK_API=true
   ```

   Create `.env.production` for production:

   ```env
   VITE_API_BASE_URL=https://your-api-url.com/api
   VITE_USE_MOCK_API=false
   ```

4. **Start development server**

   ```bash
   pnpm dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🧪 Testing with Mock API

The application includes a built-in mock API for testing. Demo credentials:

- **Email**: `demo@example.com`
- **Password**: `password123`

- **Admin User**:
  - **Email**: `admin@example.com`
  - **Password**: `password123`

The mock API simulates:

- Login with JWT token generation
- Token refresh
- Protected user data endpoints
- Token expiration handling

## 📁 Project Structure

```text
src/
├── api/                 # API client and auth API
│   ├── client.ts       # Axios instance with interceptors
│   └── auth.ts         # Authentication API calls
├── components/         # React components
│   ├── ProtectedRoute.tsx    # Route protection
│   └── RoleBasedRoute.tsx    # Role-based route protection
├── hooks/              # Custom React hooks
│   └── useAuth.ts      # Authentication hook
├── mocks/              # Mock API for development
│   ├── handlers.ts     # Mock API handlers
│   └── browser.ts      # Browser mock setup
├── pages/              # Page components
│   ├── LoginPage.tsx   # Login page
│   ├── DashboardPage.tsx # Dashboard
│   ├── AdminPage.tsx   # Admin page (role-based)
│   ├── HomePage.tsx    # Home page
│   └── UnauthorizedPage.tsx # Unauthorized page
├── types/              # TypeScript type definitions
│   └── auth.ts         # Authentication types
└── utils/              # Utility functions
    ├── tokenStorage.ts        # Token storage utilities
    └── tokenRefreshScheduler.ts # Token refresh scheduler
```

## 🔐 Authentication Flow

1. **Login**: User submits credentials via React Hook Form
2. **Token Storage**:
   - Access token stored in memory
   - Refresh token stored in localStorage
3. **Automatic Token Refresh**:
   - Tokens refreshed 2 minutes before expiration
   - Automatic refresh on 401 responses
4. **Protected Routes**: Access token validated before route access
5. **Logout**: All tokens cleared, user redirected to login

## 🚀 Deployment

### Deploy to Vercel

1. **Install Vercel CLI** (optional)

   ```bash
   pnpm add -g vercel
   ```

2. **Deploy**

   ```bash
   vercel
   ```

3. **Configure Environment Variables in Vercel**

   - Go to your project settings in Vercel
   - Add environment variables:
     - `VITE_API_BASE_URL`: Your production API URL
     - `VITE_USE_MOCK_API`: `false`

4. **Update Production URL**
   - Update the production URL in this README
   - Update the URL in `SELF_EVALUATION.md`

### Alternative: Deploy via Vercel Dashboard

1. Push your code to GitHub
2. Import the repository in Vercel
3. Configure environment variables
4. Deploy

## 🔧 Configuration

### Environment Variables

| Variable            | Description             | Default                      |
| ------------------- | ----------------------- | ---------------------------- |
| `VITE_API_BASE_URL` | API base URL            | `http://localhost:3001/api`  |
| `VITE_USE_MOCK_API` | Use mock API (dev only) | `true` (dev), `false` (prod) |

### Token Configuration

- **Access Token Expiry**: 15 minutes
- **Refresh Token Expiry**: 7 days
- **Refresh Before Expiry**: 2 minutes
- **Storage**:
  - Access token: Memory (session)
  - Refresh token: localStorage (persistent)

## 📝 Scripts

```bash
# Development
pnpm dev          # Start dev server

# Build
pnpm build        # Build for production

# Lint
pnpm lint         # Run ESLint

# Preview
pnpm preview      # Preview production build
```

## 🎯 Key Features Implementation

### 1. Axios Interceptors

- Request interceptor: Automatically attaches access token to all requests
- Response interceptor: Handles 401 errors and refreshes tokens automatically

### 2. React Query Integration

- `useMutation` for login/logout
- `useQuery` for user data
- Automatic cache invalidation on auth state changes

### 3. React Hook Form

- Email validation (pattern matching)
- Password validation (minimum length)
- Error message display
- Form submission handling

### 4. Protected Routes

- Route protection with authentication check
- Automatic redirect to login for unauthenticated users
- Preserve return URL for post-login redirect

### 5. Token Refresh Scheduler

- Automatic token refresh before expiration
- JWT expiration parsing
- Scheduled refresh timers

### 6. Multi-tab Synchronization

- Custom events for token updates
- Logout synchronization across tabs
- Token refresh synchronization

## 🐛 Troubleshooting

### Token Refresh Issues

- Check browser console for errors
- Verify refresh token is stored in localStorage
- Check API endpoint configuration

### Mock API Not Working

- Ensure `VITE_USE_MOCK_API=true` in `.env.development`
- Check browser console for errors
- Verify mock handlers are imported

### Build Issues

- Clear node_modules and reinstall: `rm -rf node_modules && pnpm install`
- Check TypeScript errors: `pnpm build`
- Verify environment variables are set

## 📚 Additional Resources

- [React Query Documentation](https://tanstack.com/query/latest)
- [React Hook Form Documentation](https://react-hook-form.com/)
- [Axios Documentation](https://axios-http.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [React Router Documentation](https://reactrouter.com/)

## 📄 License

This project is created for educational purposes as part of a homework assignment.

## 👤 Author

Created as part of Advanced Web Application Development course assignment.

---

**Note**: Update the production URL in this README and `SELF_EVALUATION.md` after deploying to Vercel.
