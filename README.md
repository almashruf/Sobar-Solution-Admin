# Sobar Solution Admin Panel

A modern admin portal for managing rooms and facilities, built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Authentication**: Secure login/logout with JWT tokens and refresh token support
- **Session Management**: Automatic token refresh and session persistence
- **Room Management**: Full CRUD operations for rooms
- **Dark/Light Theme**: Toggle between dark and light modes
- **Real-time Updates**: Live time/date display in navbar
- **Responsive Design**: Mobile-friendly interface
- **Proxy Support**: Configurable proxy mode for local development

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **HTTP Client**: Axios
- **Theme**: next-themes

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Backend API running (see Backend Setup below)

### Installation

1. Clone the repository
2. Install dependencies:

\`\`\`bash
npm install
\`\`\`

3. Create a `.env.local` file in the root directory (see Environment Variables below)

4. Run the development server:

\`\`\`bash
npm run dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

The app supports two modes: **Proxy Mode** (for local development) and **Direct Mode** (for production).

### Proxy Mode (Local Development)

Use this when developing locally with a backend at `localhost:8080` to avoid CORS issues:

\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_USE_PROXY=true
\`\`\`

### Direct Mode (Production/Staging)

Use this when deploying to production or staging environments:

\`\`\`env
NEXT_PUBLIC_API_URL=https://pos-api-dev.mohajon.app
NEXT_PUBLIC_USE_PROXY=false
\`\`\`

### Environment Variables Explained

- `NEXT_PUBLIC_API_URL`: Backend API base URL (required)
- `NEXT_PUBLIC_USE_PROXY`: Enable/disable proxy mode (true/false)
  - `true`: Routes API calls through Next.js proxy at `/api/v1` (avoids CORS in development)
  - `false`: Makes direct API calls to `NEXT_PUBLIC_API_URL` (for production)

## How Proxy Mode Works

When `NEXT_PUBLIC_USE_PROXY=true`:

1. Frontend makes requests to `/api/v1/*` (relative URL)
2. Next.js rewrites these to `${NEXT_PUBLIC_API_URL}/api/v1/*`
3. No CORS issues because requests appear to come from the same origin

When `NEXT_PUBLIC_USE_PROXY=false`:

1. Frontend makes requests directly to `${NEXT_PUBLIC_API_URL}/api/v1/*`
2. Backend must have CORS configured to allow requests from your frontend domain

## Backend API Requirements

Your backend API should implement the following endpoints:

### Authentication Endpoints

- `POST /api/v1/auth/login` - Login with email and password
  - Request: `{ email: string, password: string }`
  - Response: `{ user: User, accessToken: string }`
  - Sets refresh token as HTTP-only cookie

- `POST /api/v1/auth/logout` - Logout and clear session
  - Clears refresh token cookie

- `POST /api/v1/auth/refresh` - Refresh access token
  - Uses refresh token from cookie
  - Response: `{ accessToken: string }`

- `GET /api/v1/auth/me` - Get current user
  - Requires Authorization header with Bearer token
  - Response: `{ user: User }`

### Room Endpoints

- `GET /api/v1/rooms` - Get all rooms
  - Response: `{ rooms: Room[] }`

- `POST /api/v1/rooms` - Create new room
  - Request: `{ name, type, capacity, status, price, floor }`
  - Response: `{ room: Room }`

- `PUT /api/v1/rooms/:id` - Update room
  - Request: `{ name?, type?, capacity?, status?, price?, floor? }`
  - Response: `{ room: Room }`

- `DELETE /api/v1/rooms/:id` - Delete room
  - Response: `{ success: boolean }`

### Data Types

\`\`\`typescript
interface User {
  id: string
  email: string
  name: string
  role: string
}

interface Room {
  id: string
  name: string
  type: string
  capacity: number
  status: string
  price: number
  floor: number
  createdAt?: string
  updatedAt?: string
}
\`\`\`

## Session Management

The app implements secure session management with:

1. **Access Tokens**: Short-lived JWT tokens stored in Zustand store
2. **Refresh Tokens**: Long-lived tokens stored as HTTP-only cookies
3. **Automatic Refresh**: Axios interceptor automatically refreshes expired tokens
4. **Session Persistence**: Zustand persist middleware maintains auth state

## Project Structure

\`\`\`
app/
├── dashboard/          # Protected dashboard routes
│   ├── layout.tsx     # Dashboard layout with auth protection
│   ├── page.tsx       # Dashboard home
│   ├── rooms/         # Room management pages
│   └── profile/       # User profile page
├── login/             # Login page
├── layout.tsx         # Root layout
├── providers.tsx      # App providers (QueryClient, Theme)
└── globals.css        # Global styles

components/
├── navbar.tsx         # Top navigation bar
├── sidebar.tsx        # Side navigation menu
├── theme-provider.tsx # Theme context provider
└── ui/               # shadcn/ui components

hooks/
├── use-auth.ts       # Authentication hooks
└── use-rooms.ts      # Room CRUD hooks

lib/
├── axios.ts          # Axios instance with interceptors
└── store.ts          # Zustand auth store

next.config.mjs       # Next.js config with proxy rewrites
\`\`\`

## Development

The app is configured to work with a backend API. Make sure your backend:

1. Supports CORS with credentials (when not using proxy mode)
2. Sets HTTP-only cookies for refresh tokens
3. Returns proper error responses
4. Implements token refresh logic
5. Uses `/api/v1` as the base path for all endpoints

## Switching Between Environments

**Local Development:**
\`\`\`env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_USE_PROXY=true
\`\`\`

**Staging/Production:**
\`\`\`env
NEXT_PUBLIC_API_URL=https://pos-api-dev.mohajon.app
NEXT_PUBLIC_USE_PROXY=false
\`\`\`

You only need to change the `.env.local` file - no code changes required!

## License

MIT
