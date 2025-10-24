# 🍽️ Restaurant — Backend & Frontend (Concise README)

A clean, production-friendly stack for restaurant order management with a dark, modern UI.

---

## 🗄️ Database
- Microsoft SQL Server — Database: `RestaurantDb`

---

## ⚙️ Backend
- ASP.NET Core Web API (.NET 8)
- Entity Framework Core (SqlServer)
- Swagger (API docs)

**Key Packages**
- Microsoft.EntityFrameworkCore
- Microsoft.EntityFrameworkCore.SqlServer
- Microsoft.EntityFrameworkCore.Tools
- Swashbuckle.AspNetCore

**API Highlights**
- Base path: `/api/ordermasters`
- Server‑generated OrderNumber: `ORD‑YYYYMMDD‑####`
- Server‑side totals (line total, grand total)
- Snapshot pricing at order time (FoodItem → OrderDetail)
- DTOs centralized in `RestaurantAPI.Contracts`

---

## 💻 Frontend
- React (CRA), Axios
- Tailwind CSS (dark theme)
- Radix Select (custom dropdowns)
- Lucide Icons

**Dev Proxy**
- Frontend → `/api` → Backend (no .env needed in development)

**UI Features**
- Orders list with search
- New/Edit order forms with live totals
- Clear Back/Action buttons
- Themed dropdowns (fully dark, portal-based)

---

## 🧭 Projects / Namespaces
- API: `RestaurantAPI`
- Contracts (DTOs): `RestaurantAPI.Contracts`
