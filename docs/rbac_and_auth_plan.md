# Feature Plan: Role-Based Access Control & Authentication

This document outlines the plan to implement a robust user authentication and authorization system based on the defined user stories.

## 1. Core Technology: NextAuth.js

- **Install `next-auth`**: Integrate the `next-auth` library to handle all authentication flows.
- **Create API Route**: Set up the catch-all API route at `src/app/api/auth/[...nextauth]/route.ts`.
- **Configure Providers**:
  - Implement a `CredentialsProvider` for a simple email/password login.
  - For this initial phase, we will use a hardcoded list of users to represent the different roles, which will be stored securely.
    - **User 1 (Super Admin):** `superadmin@example.com`
    - **User 2 (Brand User):** `kf@example.com` (Brand: `korn-ferry`)
    - **User 3 (Brand User):** `magnus@example.com` (Brand: `magnus`)
- **Session Management**:
  - Create a `SessionProvider` to wrap the application, making session data (like user role and brand) globally available.
  - Extend the `Session` and `JWT` types to include `role` and `brand`.

## 2. Data Models and User Representation

- **User Type Definition**: Define a clear TypeScript type for the `User` object, including `id`, `email`, `role: 'SUPER_ADMIN' | 'BRAND_USER'`, and an optional `brand: string`.
- **Session Callback**: Implement the `session` callback in the NextAuth configuration to attach the custom `role` and `brand` fields from the user object to the session.

## 3. UI/UX for Authentication

- **Login Page**: Create a dedicated, clean, and simple login page at `/login`.
- **Header Integration**:
  - Add a "Login" button to the main header.
  - When a user is logged in, replace the "Login" button with their email and a "Logout" button.
- **Conditional Navigation**: The "Brand Setup" navigation link in the header will only be visible to users with the `SUPER_ADMIN` role.

## 4. Route Protection and Middleware

- **Create Middleware**: Implement `middleware.ts` at the project's root.
- **Define Protected Routes**:
  - The `matcher` will protect all `/admin/*` routes.
- **Authorization Logic**:
  - The middleware will check for a valid session on all matched routes, redirecting unauthenticated users to `/login`.
  - It will specifically check for the `SUPER_ADMIN` role for the `/admin/brand-setup` path, redirecting others to an "Access Denied" or home page.

## 5. API Authorization Enforcement

- **Brand API (`/api/brand`)**:
  - `GET`: Accessible to all authenticated users.
  - `POST`: Restricted to `SUPER_ADMIN` only. The API will check the session token for the user's role.
- **Personas API (`/api/personas/*`)**:
  - All persona-related endpoints (`/generate`, `/save`, `/delete`) will be refactored to be brand-aware.
  - **Super Admins**: Can perform operations on any brand, specifying the target brand in the API request.
  - **Brand Users**: Can only perform operations on their own assigned brand. The API will enforce this by using the `brand` property from the user's session, ignoring any brand passed in the request body.

## 6. Role-Aware UI Components

- **Persona Upload Page (`/admin/upload`)**:
  - **For Super Admins**: The page will include a dropdown menu to select the target brand for the persona upload.
  - **For Brand Users**: The brand selection dropdown will be hidden, and all uploads will automatically be associated with their brand.
- **Persona Listing Page (`/personas`)**:
  - The main persona list will be filtered based on user role.
  - **Super Admins** will see personas from all brands, possibly with a filter or visual indicator.
  - **Brand Users** will only see personas associated with their brand.

This plan ensures a secure and scalable architecture that aligns with the user stories.
