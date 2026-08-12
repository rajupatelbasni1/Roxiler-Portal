# 🚀 Live Deployment

> **Roxiler Portal Project — Full-Stack Store Rating & Management Portal**

### 🌐 Try the Live Application
**[🔗 Open Roxiler Store Rating & Management Portal](https://roxiler-portal.vercel.app/)**

The project is deployed using a production-style full-stack architecture:

| Layer | Technology | Deployment |
| :--- | :--- | :--- |
| **Frontend** | React + Vite | **Vercel** |
| **Backend / REST API** | Node.js + Express.js | **Render** |
| **Database** | PostgreSQL | **Supabase** |
| **Source Code** | Git + GitHub | **GitHub** |

### 🏗️ Deployment Architecture

```text
┌───────────────────────────────┐
│       React + Vite            │
│          Vercel               │
│  roxiler-portal.vercel.app    │
└───────────────┬───────────────┘
                │ HTTPS / REST API
                ▼
┌───────────────────────────────┐
│      Node.js + Express.js     │
│           Render              │
│   roxiler-portal.onrender.com │
└───────────────┬───────────────┘
                │ PostgreSQL
                ▼
┌───────────────────────────────┐
│       PostgreSQL Database     │
│           Supabase            │
└───────────────────────────────┘
```

### ✨ Deployment Highlights

- **Frontend:** Production Vite build deployed on Vercel.
- **Backend:** Express.js REST API deployed as a live Render service.
- **Database:** PostgreSQL hosted on Supabase and connected securely to the backend through environment variables.
- **API Communication:** React communicates with the Express backend over HTTPS.
- **Security:** Database credentials and JWT secrets are kept in deployment environment variables rather than hard-coded in the application.
- **Source Control:** The complete project is maintained with Git and GitHub.

---

# Store Rating & Management Portal

A full-stack web application built with **Node.js, Express, PostgreSQL, and React (Vite)** featuring Role-Based Access Control (Admin, Store Owner, Normal User), store rating systems, dynamic filtering, sorting, and dark/light mode UI.

---

## 🔑 Login Credentials (Quick Access)

> **Note:** All standard accounts use the password: **`Mahadev@1234`**

| Role | Name | Email ID | Password |
| :--- | :--- | :--- | :--- |
| **System Admin** | Raju Patel Basni Jutha | `rajupatelbasni@gmail.com` | `Mahadev@1234` |
| **Store Owner** | Raju Patel Ki Kirane Ki Dukan | `rajupatel@gmail.com` | `Mahadev@1234` |
| **Normal User** | Raju Patel Ke Kirana Store Ka Regular Customer | `raju@gmail.com` | `Mahadev@1234` |
| **Normal User** | Manish hshshshshshshshshshs | `manish@gmail.com` | `Mahadev@1234` |

---

## 🛠️ Tech Stack
* **Frontend:** React, React Router, Axios, Vite
* **Backend:** Node.js, Express.js, JWT Authentication, Bcrypt
* **Database:** PostgreSQL

---

## 📋 Project Requirements & Dependencies

### Backend (`my-express-app`)
* `express`: ^4.19.2
* `pg`: ^8.11.3
* `bcrypt`: ^5.1.1
* `jsonwebtoken`: ^9.0.2
* `cors`: ^2.8.5
* `dotenv`: ^16.4.5
* `nodemon`: ^3.1.0 (Dev)

### Frontend (`frontend`)
* `react`: ^18.3.1
* `react-dom`: ^18.3.1
* `react-router-dom`: ^6.23.1
* `axios`: ^1.6.8
* `vite`: ^5.2.11

---

## 📂 Project Directory Structure

expressjsapp/
├── my-express-app/        # Backend Server
│   ├── config/            # DB Configuration
│   ├── controllers/       # Route Logic
│   ├── middleware/        # JWT & Role Verification
│   ├── routes/            # API Endpoints
│   └── index.js           # Server Entry Point
└── frontend/              # React Frontend
├── src/
│   ├── pages/         # Login, Signup, Dashboards
│   └── App.jsx        # Main App & Routing
└── vite.config.js

