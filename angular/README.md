# Angular Secure Admin Portal

A mini admin portal featuring a Login Page and a Protected Dashboard.

## Features
- **Authentication Flow**: Reactive login form, simulated authentication, token storage in `localStorage`, and route guard protection.
- **Protected Dashboard**: CRUD operations (Add, Edit, Delete) with interactive forms.
- **Search & Filter**: Search functionality on records.
- **API Security**: HTTP Interceptor that automatically attaches the stored Bearer token to all outgoing HTTP requests.
- **UX**: Tailwind Classes, loading indicators, and toast notifications.

## Tech Stack
- Angular 18+ (Standalone Components API)
- TypeScript
- Reactive Forms
- Tailwind CSS (v4)

## Setup & Running Locally

1. Navigate to the project folder:
   ```bash
   cd angular
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm start
   ```
   Open `http://localhost:4200` in your browser.

4. Build for production:
   ```bash
   npm run build
   ```

## Demo Credentials
- **Email**: `hellygoswami1810@gmail.com`
- **Password**: `Helly@001`

## Authentication State Handling
1. **Login**: The login page verifies the credentials. Upon success, a mock JWT token is returned and stored in `localStorage` under the key `token`.
2. **Guarded Access**: The `authGuard` functional route guard intercepts navigation to `/dashboard`. If the `token` is missing, it redirects the browser to `/login`.
3. **HTTP Interceptor**: The `authInterceptor` intercepts all outgoing requests made via Angular's `HttpClient` and inserts the `Authorization: Bearer <token>` header if a token is present in storage.
4. **Logout**: Logging out deletes the token from `localStorage` and routes the user back to the login page.
