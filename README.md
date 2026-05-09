# EliteHostel Hub 🏨

> Enterprise-grade Student Housing Management System

A modern, full-stack hostel management ERP built with **Next.js 14**, **PostgreSQL**, **Prisma ORM**, and **Tailwind CSS**. Features role-based access control, real-time analytics, and a premium dark-mode UI.

## ✨ Features

- **Role-Based Access Control** — Admin, Warden, and Student portals
- **Admin Dashboard** — Real-time analytics for occupancy, revenue, and complaints
- **Room Management** — Full CRUD with search, filtering, and pagination
- **Booking Engine** — Track check-ins, check-outs, and reservation status
- **Payment Tracking** — Financial ledger with transaction history
- **Complaint System** — Ticketing system with priority levels and status transitions
- **Reports & Analytics** — Payment breakdowns, resolution rates, room utilization
- **Secure Authentication** — JWT-based auth with bcrypt password hashing
- **Premium UI/UX** — Glassmorphism, Framer Motion animations, responsive design

## 🚀 Tech Stack

| Category       | Technology                          |
| -------------- | ----------------------------------- |
| Framework      | Next.js 14 (App Router, TypeScript) |
| Styling        | Tailwind CSS v4                     |
| Database       | PostgreSQL + Prisma ORM             |
| Authentication | NextAuth.js (JWT)                   |
| Validation     | Zod                                 |
| Animations     | Framer Motion                       |
| Icons          | Lucide React                        |

## 📦 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database

### Installation

```bash
# Clone the repository
git clone https://github.com/Muhammad-Talha990/elite-hostel-hub.git
cd elite-hostel-hub

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Update DATABASE_URL with your PostgreSQL credentials

# Push schema to database
npm run db:push

# Seed with demo data
npm run db:seed

# Start dev server
npm run dev
```

### Demo Credentials

| Role    | Email              | Password   |
| ------- | ------------------ | ---------- |
| Admin   | admin@hostel.com   | admin123   |
| Warden  | warden@hostel.com  | warden123  |
| Student | student@hostel.com | student123 |

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── admin/              # Admin portal pages
│   ├── student/            # Student portal pages
│   ├── warden/             # Warden portal pages
│   ├── api/                # REST API routes
│   ├── login/              # Auth pages
│   └── register/
├── components/             # Reusable components
│   ├── dashboard/          # Dashboard-specific
│   └── ui/                 # UI primitives
├── lib/                    # Utilities, Prisma client, auth config
└── types/                  # TypeScript type definitions
```

## 🛡️ Security

- JWT tokens stored in HttpOnly cookies
- Bcrypt password hashing (12 rounds)
- Zod input validation on all API routes
- Role-based middleware route protection
- CSRF protection via Next.js Server Actions

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.
