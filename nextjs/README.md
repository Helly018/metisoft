# Next.js Protected Dashboard with Server-Side Data Table

A Next.js application implementing authentication, page middleware protection, and a server-side paginated data table.

## Features
- **Cookie Authentication**: Authenticates credentials and stores the session token inside an HTTP-only cookie.
- **Middleware Security**: Automatically checks cookie tokens for `/dashboard` routes and redirects to `/login` if missing or expired.
- **Server-Side Data Table**: Reusable, type-safe table featuring pagination, sorting, and search filtering handled on the server.
- **API Protection**: `/api/users` route verifies the cookie token and responds with a 401 status code if unauthorized.
- **Static Pages**: A `/static` public page to showcase that unauthenticated users can access it without being redirected.

## Tech Stack
- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS

## Setup & Running Locally

1. Navigate to the project folder:
   ```bash
   cd nextjs
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

4. Build for production:
   ```bash
   npm run build
   ```

## API Endpoints
- **POST `/api/login`**: Accepts `email` and `password`. Returns JSON status and sets an HTTP-only `token` cookie.
- **POST `/api/logout`**: Deletes the `token` cookie.
- **GET `/api/users`**: Protected endpoint that accepts query parameters:
  - `page` (number, default: 1)
  - `limit` (number, default: 10)
  - `sortBy` (string, default: id)
  - `order` (asc | desc, default: asc)
  - `search` (string, default: '')

## Demo Credentials
- **Email**: `hellygoswami1810@gmail.com`
- **Password**: `Helly@001`

## Authentication State Handling
1. **Cookie Storage**: Upon successful login, the server generates a token (containing base64-encoded metadata and an expiration timestamp) and writes it into an HTTP-only, secure, sameSite cookie.
2. **Middleware Router Guard**: The `middleware.ts` intercepts all requests to `/dashboard`. It extracts the cookie, decodes the payload, and verifies the token and its expiration date. If verification fails, it redirects to `/login`.
3. **Protected APIs**: The `/api/users` route runs verification checks on the cookie token directly on the server before responding with user data. If not authenticated, it returns a 401 response status.
