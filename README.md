Restaurant — Backend/Frontend README (Concise)

Database: Microsoft SQL Server (RestaurantDb)

Backend: ASP.NET Core Web API (.NET 8), Entity Framework Core, Swagger

Key Packages (API): EF Core, EF Core SqlServer, EF Tools, Swagger

Frontend: React (CRA), Axios, Tailwind CSS, Radix Select, Lucide Icons

Dev Proxy: Frontend → Backend via “/api”

Core Features:

Orders CRUD under /api/ordermasters

Server‑generated OrderNumber (ORD‑YYYYMMDD‑####)

Server‑side totals (line and grand total)

Snapshot pricing per FoodItem at order time

Dark UI with searchable orders, New/Edit forms, Back/Action buttons

Projects/Namespaces:

API: RestaurantAPI

Contracts: RestaurantAPI.Contracts (DTOs)
