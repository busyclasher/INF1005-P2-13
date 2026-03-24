# Fitness Class Booking System

## Overview
This project is a web-based fitness class booking system. It allows users to register, log in, view available fitness classes, manage their profile, and book or cancel class sessions. The application features a modern React frontend and a PHP/MySQL backend.

## Tech Stack
*   **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Radix UI components, React Router.
*   **Backend:** PHP 8+, MySQL.
*   **Architecture:** Client-Server model with RESTful JSON APIs.

## Project Structure

```text
.
├── backend/                # PHP API endpoints and database configuration
│   ├── api/                # Individual API endpoints (e.g., login.php, bookings.php)
│   ├── db_config.php       # Database configuration settings
│   └── ...
├── src/                    # Frontend React application source code
│   ├── app/                
│   │   ├── components/     # Reusable UI components (buttons, dialogs, layout)
│   │   ├── context/        # React Context providers (AuthContext)
│   │   ├── pages/          # Full page components (Dashboard, Classes, Login, etc.)
│   │   ├── routes.tsx      # Application routing configuration
│   │   └── App.tsx         # Root component
│   ├── styles/             # Global CSS and Tailwind directives
│   └── main.tsx            # Frontend entry point
├── package.json            # Frontend dependencies and scripts
└── vite.config.ts          # Vite bundler configuration
```

## Setup Instructions

### Prerequisites
*   Node.js (v18+ recommended)
*   PHP (v8.0+)
*   MySQL Server
*   A local web server environment (e.g., XAMPP, MAMP, or PHP's built-in server)

### 1. Database Setup
1. Start your MySQL server.
2. Create a new database named `assignment`.
3. Import the required schema (if a `.sql` file is provided, or use `backend/api/seed.php` if applicable).
4. Update the database credentials in `backend/api/db.php` to match your local MySQL setup:
   ```php
   $host = 'localhost';
   $db   = 'assignment';
   $user = 'your_mysql_username';
   $pass = 'your_mysql_password';
   ```

### 2. Backend Setup
1. Serve the `backend` directory using your local web server.
2. If using PHP's built-in server, you can run the following command from the project root:
   ```bash
   php -S localhost:8000 -t backend
   ```
3. Ensure CORS headers in the PHP files allow requests from your frontend development server (usually `http://localhost:5173`).

### 3. Frontend Setup
1. Open a terminal in the project root directory.
2. Install the frontend dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to the URL provided by Vite (typically `http://localhost:5173`).

*(Note: The frontend currently has hardcoded API URLs pointing to a specific IP address. For local development, you may need to update these URLs in `src/app/context/AuthContext.tsx` and the page components to point to your local backend, e.g., `http://localhost:8000/api`.)*

## Roadmap & Known Issues
This project is currently undergoing a security and architectural review. The following improvements are planned:

*   **Security (High Priority):**
    *   Implement JWT (JSON Web Tokens) for secure, stateless authentication.
    *   Fix Broken Access Control (IDOR) vulnerabilities by relying on server-side token validation rather than client-provided user IDs.
    *   Remove hardcoded database credentials and implement environment variables (`.env`).
*   **Architecture:**
    *   Consolidate database connections to use a single, unified configuration file.
    *   Centralise frontend API calls into a dedicated service utility to manage base URLs and authentication headers automatically.
*   **Performance & Quality:**
    *   Optimise backend SQL queries (e.g., joining classes and sessions on the server rather than the client).
    *   Implement proper error handling and disable PHP error display in production endpoints.
