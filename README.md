# SecureVoteSphere

A full-stack online voting system built with security at its core. SecureVoteSphere implements AI-powered facial recognition for voter identity verification, role-based access control, real-time security monitoring, and a zero-trust architecture to ensure election integrity.

---

## Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database](#database)
- [Usage](#usage)
- [API Overview](#api-overview)
- [License](#license)

---

## About

SecureVoteSphere is a web-based voting platform designed to handle the full lifecycle of an election -- from voter registration and identity verification through ballot casting and result auditing. The system separates concerns into a voter-facing flow and an admin dashboard, with security logging and AI-based defenses running throughout.

The project was built as part of a university course project (2022-CS-62 / 2022-CS-92).

---

## Features

### Voter Side
- **Voter login** with unique Voter ID and password (bcrypt-hashed)
- **Facial recognition verification** using face-api.js before ballot access
- **Ballot casting** with duplicate vote prevention and unique verification IDs
- **Real-time session tracking** via WebSockets

### Admin Side
- **Admin login** with multi-factor authentication (password + security token)
- **Dashboard** with voter turnout, security status, verification stats, and system performance
- **Election management** -- create, activate, and manage elections and candidates
- **Voter registry** -- view and manage registered voters
- **Ballot design** -- configure ballot layouts and positions
- **Audit controls** -- review comprehensive security and event logs
- **AI defense monitoring** -- track verification accuracy, processing time, and error distribution
- **Security controls** -- manage zero-trust policies, view threat detection results, and monitor system health

### Security
- Zero-trust middleware that validates every API request
- Input sanitization and injection detection on query parameters
- Comprehensive audit trail logged to the `security_logs` table
- Real-time WebSocket broadcast of critical and warning events to admin clients
- Session management with HTTP-only cookies and configurable expiry
- Role-based route protection on both client and server

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| TypeScript | Type safety |
| Vite | Build tool and dev server |
| TailwindCSS | Utility-first styling |
| shadcn/ui (Radix UI) | Accessible component primitives |
| React Query | Server state management |
| Wouter | Client-side routing |
| Framer Motion | Animations |
| Recharts | Dashboard charts and data visualization |
| face-api.js | Browser-based facial recognition |
| React Hook Form + Zod | Form handling and validation |

### Backend
| Technology | Purpose |
|---|---|
| Express | HTTP server and API routing |
| Drizzle ORM | Type-safe database queries |
| PostgreSQL (Neon) | Primary data store |
| bcryptjs | Password hashing |
| express-session | Session management |
| ws | WebSocket server for real-time events |
| Zod | Runtime request validation |
| esbuild | Server bundle for production |

---

## Project Structure

```
SecureVoteSphere/
├── client/                  # React frontend
│   ├── index.html
│   └── src/
│       ├── App.tsx          # Routes and app shell
│       ├── pages/           # Page components
│       │   ├── login.tsx
│       │   ├── verification.tsx
│       │   ├── voter-ballot.tsx
│       │   ├── admin-dashboard.tsx
│       │   ├── manage-elections.tsx
│       │   ├── voter-registry.tsx
│       │   ├── ballot-design.tsx
│       │   ├── audit-controls.tsx
│       │   ├── ai-defenses.tsx
│       │   └── security-controls.tsx
│       ├── components/      # Reusable UI components (shadcn/ui)
│       ├── hooks/           # Custom React hooks (auth, websocket)
│       └── lib/             # Utility functions and query client
├── server/                  # Express backend
│   ├── index.ts             # Server entry point
│   ├── routes.ts            # API route definitions
│   ├── auth.ts              # Authentication and session setup
│   ├── security.ts          # Zero-trust middleware and security logging
│   ├── storage.ts           # Data access layer (memory + database)
│   ├── websocket.ts         # WebSocket server for real-time alerts
│   ├── db.ts                # Database connection
│   └── seed.ts              # Database seeding
├── shared/
│   └── schema.ts            # Drizzle schema and Zod validation schemas
├── drizzle.config.ts        # Drizzle Kit configuration
├── vite.config.ts           # Vite configuration
├── tailwind.config.ts       # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm
- A PostgreSQL database (the project is configured for [Neon](https://neon.tech/) by default, but any PostgreSQL instance will work)

### Installation

1. Clone the repository:

```bash
git clone https://github.com/<your-username>/SecureVoteSphere.git
cd SecureVoteSphere
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables (see [Environment Variables](#environment-variables) below).

4. Push the database schema:

```bash
npm run db:push
```

5. Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5000` (or whichever port is configured).

### Production Build

```bash
npm run build
npm start
```

---

## Environment Variables

Create a `.env` file in the project root with the following:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string (required) |
| `SESSION_SECRET` | Secret key for signing session cookies (recommended for production) |

---

## Database

The database schema is defined in `shared/schema.ts` using Drizzle ORM. It includes the following tables:

- **users** -- stores voters, admins, and observers with hashed passwords and optional face data
- **elections** -- election metadata including title, description, date range, and active status
- **candidates** -- candidates linked to elections with party affiliation and position
- **ballots** -- cast votes with a unique verification ID per ballot (choices stored as JSON)
- **security_logs** -- timestamped audit trail with event, category, severity, and metadata

Schema changes are managed through Drizzle Kit:

```bash
npm run db:push
```

---

## Usage

### Default Accounts (Development)

The in-memory storage layer seeds the following accounts for testing:

| Role | Username / Voter ID | Password | Security Token |
|---|---|---|---|
| Admin | `admin` | `admin123` | `123456` |
| Voter | `VOT-789456` | `password123` | -- |
| Voter | `VOT-123789` | `password123` | -- |

### Voter Flow

1. Log in with your Voter ID and password
2. Complete facial recognition verification
3. Cast your ballot
4. Receive a unique verification ID as a receipt

### Admin Flow

1. Log in with admin credentials and security token
2. Access the dashboard for a system overview
3. Use the sidebar to navigate between election management, voter registry, ballot design, audit logs, AI defense monitoring, and security controls

---

## API Overview

All API endpoints are prefixed with `/api`.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/voter/login` | Voter authentication |
| POST | `/api/auth/admin/login` | Admin authentication (with MFA) |
| POST | `/api/auth/logout` | End session |
| GET | `/api/auth/session` | Check current session |
| GET | `/api/elections/active` | Get the active election with candidates |
| POST | `/api/elections` | Create an election (admin) |
| POST | `/api/candidates` | Add a candidate (admin) |
| POST | `/api/ballots` | Submit a ballot (voter) |
| GET | `/api/admin/system-status` | System overview metrics (admin) |
| GET | `/api/admin/ai-metrics` | AI verification performance (admin) |
| GET | `/api/admin/security-logs` | Recent security events (admin) |
| GET | `/api/admin/users` | List all users (admin) |
| POST | `/api/verification/complete` | Record identity verification |
| POST | `/api/security/report` | Client-side security report |
| GET | `/api/security/status` | Security status summary (admin) |

WebSocket connections are available at `/ws` for real-time security event streaming.

---

## License

This project is licensed under the MIT License.
