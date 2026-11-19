# QuoteWise Frontend

Modern, component-driven React application for managing Requests for Quotation (RFQs) and supplier quotations.

## Tech Stack

- **Framework:** React.js 18 + Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM v6
- **HTTP Client:** Axios (centralized client instance)
- **Icons:** Lucide React

## Project Architecture

This project follows a feature-based, component-driven modular architecture:

```
frontend/
├── public/
├── src/
│   ├── assets/            # Static media and assets
│   ├── components/        # Reusable global components
│   │   ├── common/        # Shared presentation components (Spinners, Empty states)
│   │   ├── layout/        # Shell layout, Sidebar, and Header
│   │   └── ui/            # Primitive UI atoms (Button, Card, Input, Badge)
│   ├── features/          # Feature-sliced domains
│   │   ├── rfq/           # RFQ domain: pages, components, services, hooks, types, utils
│   │   └── quotations/    # Quotation domain: pages, components, services, hooks, types, utils
│   ├── hooks/             # Global custom hooks
│   ├── lib/               # Third-party wrappers (Axios client)
│   ├── routes/            # Application router definitions
│   ├── types/             # Global TypeScript declarations
│   ├── utils/             # Helper utilities and formatters
│   ├── App.tsx
│   └── main.tsx
├── .env.example
├── package.json
└── tsconfig.json
```

## Getting Started

### Prerequisites

- Node.js (>= 18)
- npm or pnpm

### Installation

```bash
cd quotewise-frontend
npm install
```

### Environment Configuration

Copy the example environment configuration:

```bash
cp .env.example .env
```

Ensure `VITE_API_BASE_URL` points to your backend instance:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### Development Server

```bash
npm run dev
```

The application runs by default at `http://localhost:5173`.

### Production Build & Type Checking

```bash
npm run build
```
