# Smart Inventory System

## Project Overview

**Smart Inventory** is a full-stack inventory management system that allows businesses to manage products, customers, suppliers, orders, and user access through a secure, role-based web application.

---

## Application Question Answer

**Have you completed any academic or personal projects involving code or technical solutions?**

> **Yes.** Here is a description of this project:

### Project: Smart Inventory Management System

**Tools Used:**
- **Backend:** Java 17, Spring Boot 3, Spring Security, JWT authentication, JPA/Hibernate, PostgreSQL, Maven
- **Frontend:** Angular 20, TypeScript 5, Angular Material, RxJS, SCSS
- **Testing & Tooling:** Postman (API testing), H2 (in-memory DB for testing), Karma/Jasmine (unit tests), Prettier (code formatting)

**My Role:**
- Designed and implemented the full backend REST API including authentication, authorization, and all core business logic (products, orders, customers, suppliers, users).
- Built the Angular frontend with standalone components, route guards, and reactive forms.
- Defined the database schema with 13+ JPA entities and managed relationships (one-to-many, many-to-many).
- Implemented role-based access control (RBAC) with three roles: **Manager**, **Admin**, and **Agent**, each with specific permissions enforced on both the API and UI layers.
- Wrote a comprehensive Postman test suite covering authentication, authorization, CRUD operations, and security validations (SQL injection, XSS attempts).

**Outcome:**
- Delivered a production-ready inventory management platform with secure JWT-based login, real-time order and payment tracking, and a responsive Material Design UI.
- The system supports multi-user collaboration with fine-grained access control, reducing manual inventory errors and providing a clear audit trail of all operations.
- Security hardening (parameterized queries, input validation, password hashing, CORS configuration) ensures the application is resilient to common web vulnerabilities.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend Framework | Spring Boot 3.5.5 (Java 17) |
| Security | Spring Security + JWT |
| Database | PostgreSQL (port 5433) |
| ORM | JPA / Hibernate |
| Frontend Framework | Angular 20 |
| UI Components | Angular Material 20 |
| HTTP / State | Angular HttpClient + RxJS 7.8 |
| Build Tools | Maven (backend), Angular CLI (frontend) |

---

## Key Features

- **Authentication & Authorization** – JWT tokens with 24-hour expiry; role-based endpoint protection
- **User Management** – Create, update, and delete users; assign roles (Manager / Admin / Agent)
- **Product Management** – Track product inventory with supplier associations
- **Order Management** – Create orders, manage order items, track status, and schedule payments
- **Customer & Supplier Management** – Full CRUD for customers and suppliers
- **Notifications & Returns** – Built-in notification system and returns tracking
- **Security** – SQL injection protection, XSS mitigation, password hashing

---

## Running the Project

### Backend

```bash
cd backend
mvn spring-boot:run
# Starts on http://localhost:3020
```

### Frontend

```bash
cd frontend
npm install
npm start
# Starts on http://localhost:4200
```

### Default Credentials

| Role    | Email                       | Password    |
|---------|-----------------------------|-------------|
| Manager | manager@inventory.com       | manager123  |
| Admin   | admin@inventory.com         | admin123    |

---

## API Testing

See [POSTMAN_TESTS.md](./POSTMAN_TESTS.md) for the complete Postman test collection covering 25+ test scenarios across authentication, authorization, user management, and security validation.
