# 🏢 BME Accounts Management System

[![Next.js](https://img.shields.io/badge/Next.js-14.2.16-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-20-green?logo=node.js)](https://nodejs.org)
[![MySQL](https://img.shields.io/badge/MySQL-8-purple?logo=mysql)](https://mysql.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-cyan?logo=tailwind)](https://tailwindcss.com)

**Comprehensive full-stack business accounting dashboard** for small-medium enterprises (e.g., trading/retail shops). Track daily sales/expenses, staff attendance/salary, inventory, creditors, bank/savings, pigmy collections, maintenance, with role-based access, audit logs, backups.

## ✨ Features

- **📊 Dashboard & Analytics** - Real-time charts, KPIs, notifications
- **💰 Daily Entries** - Cash/bank/sales vs expenses (mutton/chicken/grocery/etc.), auto-profit calc
- **👥 HR Management** - Staff (multi-employment history), attendance, salary payments
- **📦 Inventory & Indent** - Stock tracking, procurement requests
- **💳 Finance** - Creditors (multi-payment), Bank accounts/transactions, Savings/FDs
- **🐷 Pigmy Scheme** - Collections (S) & Retrievals (R), payment modes
- **🔧 Maintenance** - Tickets, expenses, categories (UPS/electrical/plumbing/etc.)
- **🔐 Admin Tools** - User mgmt (roles/permissions), Logs, Backup/Restore/Delete, Tickets
- **📱 Responsive UI** - Role-based Sidebar, Toast notifications, JWT auth
- **🛡️ Security** - Audit logs, IP tracking, password reset, approval workflows

**Roles**: Admin/Owner/Manager/Cashier/User-Admin/User

## 📱 Demo
*(Add screenshot/GIF here: Dashboard, Entries form, Staff list)*

## 🏗️ Architecture

```
BME Accounts System
├── client/ (Next.js App Router + React/TS + Tailwind)
│   ├── app/page.tsx (Main App: Login → Role-based Dashboard)
│   └── components/ (30+: Dashboard, Staff, Entries, etc.)
├── server/ (Express/Node + MySQL)
│   ├── src/routes/ (13 modules: auth/staff/entries/etc.)
│   ├── src/controllers/
│   ├── database/schema.sql (20+ tables/views)
│   └── utils/ (migrations, backups, email)
└── accounts_db (MySQL)
```

## 📁 Project Structure

```
Bme main/
├── client/                 # Next.js 16 Frontend
│   ├── app/
│   │   ├── page.tsx        # Main app logic
│   │   ├── globals.css
│   │   └── reset-password/
│   ├── components/         # 25+ React components
│   └── package.json        # Next/React/Recharts/Toastify
├── server/                 # Express Backend
│   ├── src/
│   │   ├── controllers/    # 12 controllers
│   │   ├── routes/         # 13 route files
│   │   ├── middleware/     # Auth/Error handling
│   │   ├── models/         # DB models
│   │   └── utils/          # Migrations/Backups/Email
│   ├── database/
│   │   ├── schema.sql      # Full DB schema
│   │   └── backups/        # JSON dumps
│   └── package.json        # Express/MySQL2/JWT/Bcrypt
├── .gitignore
├── README.md              # This file!
└── TODO.md                # Dev tasks
```

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- MySQL 8+
- Git

```bash
git clone <repo>
cd "Bme main"
```

### 1. Backend Setup
```bash
cd server
copy .env.example .env  # Edit DB creds
npm install
# Init DB:
mysql -u root -p < database/schema.sql
npm run dev  # http://localhost:5000/api/health
```

### 2. Frontend Setup
```bash
cd ../client
npm install
npm run dev  # http://localhost:3000
```

**Default Login**: `admin` / `password123` (change immediately!)

### Environment Variables (server/.env)
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpass
DB_NAME=accounts_db
JWT_SECRET=your-super-secret-key
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

## 🗄️ Database Overview

**Main Tables** (Full schema: `server/database/schema.sql`):
| Module | Tables/Views | Key Fields |
|--------|--------------|------------|
| Users | `users` | role, permissions (JSON), approval_status |
| Entries | `entries` | date, sales, expenses (mutton/chicken/etc.), profit (generated) |
| Staff/Attendance | `staff`, `attendance` | staff_id, multi-joining_dates, status (Present/Absent/etc.) |
| Salary | `salaries` | staff_id, amount, payment_mode (Cash/UPI) |
| Creditors | `creditors` | bill_amount, multi-payments, status |
| Inventory | `inventory` | product, qty, rates |
| Indent | `indents` | item, qty, total_price |
| Bank | `bank_accounts`, `bank_transactions` | account_no, debit/credit/balance |
| Savings | `savings_accounts`, `savings_transactions` | principal/interest, maturity |
| Pigmy | `pigmy_r`, `pigmy_s_view` | amount, payment_mode, paid_by |
| Maintenance | `maintenance_tickets`, `maintenance_entries`, `categories` | issue, amount, priority/status |
| Audit | `logs`, `notifications` | user/action/module, type/target_users |

**Defaults**: Sample users/items/categories pre-loaded.

## 🔌 API Endpoints

All `/api/*` (JWT protected except auth):
- `/api/auth` - login/logout/me/reset-password
- `/api/staff` - CRUD staff/attendance
- `/api/entries` - Daily CRUD, summaries
- `/api/attendance/salary/creditors/inventory/indent/savings/bank/pigmy/maintenance` - Module-specific CRUD
- `/api/users` - Manage users
- `/api/logs` - Audit logs

**Health**: `GET /api/health`

## 🎛️ Role-Based Access

| Feature | Admin | Manager | Cashier |
|---------|-------|---------|---------|
| Dashboard | ✅ | ✅ | ✅ |
| Entries | ✅ Edit+Del | ✅ Edit | ✅ View+New |
| Staff | ✅ Full | ✅ View | ❌ |
| Backup/Delete | ✅ | ❌ | ❌ |

Permissions stored as JSON in `users.permissions/edit_access/delete_access`.

## 💾 Backup & Restore

- **JSON Backups**: `server/database/backups/*.json`
- **Frontend**: BackupRestore component
- **DB Dump**: `mysqldump accounts_db > backup.sql`

## 🔍 Frontend Components

25+ routed via Sidebar:
- Dashboard, Analytics, NewEntry/ViewEntries, Staff, Attendance, Salary
- Creditors, Inventory, Indent, Savings, BankAccounts
- PigmyS/R, Maintenance, RaiseTicket, Logs, ManageUsers
- BackupRestore, DeleteData

## 🐛 Troubleshooting

- **CORS**: Check `NODE_ENV`, `CLIENT_URL`
- **DB Connection**: Verify `.env`, run schema.sql
- **Login Fail**: Check hashed password, JWT_SECRET
- **Logs**: Check `logs` table, console
- **Migrations**: Run utils/apply_migration.js etc.

## 🤝 Contributing

1. Fork & PR
2. Follow TS/ESLint
3. Add tests (server/test-results.txt)
4. Update schema/migrations for DB changes

## 📄 License

ISC - See `server/package.json`

## 🙏 Acknowledgments

Built with ❤️ for small business accounting. Contributions welcome!

---

*⭐ Star if useful! Questions? Open Issue.*

