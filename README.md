# QuoteWise — Frontend

A modern, responsive React web application for creating RFQs (Request for Quotations), submitting supplier quotes, and comparing bids.

## Features

- **Authentication Flow**: User sign-in, registration, and protected routes.
- **RFQ Dashboard**: Browse, filter, search, and create RFQs with dynamic status badges (`OPEN`, `QUOTED`, `EXPIRED`).
- **Quote Comparison**: View all submitted quotes per RFQ with clear highlights for the **Best Quote** based on price, valid date, and lead time.
- **Quotation Submission**: Quick and simple form for suppliers to submit quotes with real-time validation.
- **Responsive UI**: Built with Tailwind CSS and Lucide icons for desktop and mobile views.

## Tech Stack

- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **State Management**: Redux Toolkit & React-Redux
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM v6
- **Forms & Validation**: Yup
- **HTTP Client**: Axios
- **Notifications**: React Toastify
- **Icons**: Lucide React

---

## Getting Started

### 1. Prerequisites

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)

### 2. Installation

```bash
cd quotewise-frontend
npm install
```

### 3. Environment Variables

Create a `.env` file in the root of `quotewise-frontend`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 4. Run the Application

```bash
# Start Vite development server
npm run dev

# Type check
npm run lint

# Build for production
npm run build

# Preview production build locally
npm run preview
```

The frontend will be available at: **http://localhost:5173**

---

## Project Structure

```
quotewise-frontend/
├── public/               # Static assets
├── src/
│   ├── components/       # Common reusable UI components (Header, Sidebar, Buttons, etc.)
│   ├── features/
│   │   ├── auth/         # Login, Register, Auth state & hooks
│   │   ├── rfq/          # RFQ listing, details, creation, and state
│   │   └── quotations/   # Quote submission, comparison, and cards
│   ├── hooks/            # Global custom hooks
│   ├── lib/              # Axios API client setup
│   ├── pages/            # Page-level components & 404 page
│   ├── routes/           # Application router and protected route guards
│   ├── store/            # Redux Toolkit store and root reducer
│   ├── types/            # TypeScript type declarations
│   ├── utils/            # Formatting and helper utilities
│   ├── App.tsx           # App root component
│   └── main.tsx          # Application entry point
├── .env.example
├── index.html
├── tailwind.config.js
└── vite.config.ts
```
