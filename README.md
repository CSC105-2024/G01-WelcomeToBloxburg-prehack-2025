# 🚀 HereWeGo

A full-stack web application to manage trips and participants with seamless authentication and CRUD operations. Built for a hackathon using modern technologies like React, Tailwind CSS, Node.js,Hono and Prisma.

## 🛠️ Tech Stack

### Frontend
- **React** – Component-based UI library
- **Tailwind CSS** – Utility-first CSS for fast UI development

### Backend
- **Node.js & Hono** – REST API server
- **Prisma** – Modern ORM for database interaction
- **JWT Authentication** – Secure access for authenticated users

---

## 🔌 API Routes

### 📍 `/trip`
| Method | Endpoint        | Description                     |
|--------|------------------|---------------------------------|
| GET    | `/`              | Get all trips                   |
| GET    | `/:id`           | Get a single trip               |
| POST   | `/`              | Create a trip (auth required)   |
| PATCH  | `/:id`           | Update a trip                   |
| DELETE | `/:id`           | Delete a trip                   |

### 👥 `/participant`
| Method | Endpoint        | Description                           |
|--------|------------------|---------------------------------------|
| GET    | `/`              | Get all trip participants             |
| POST   | `/`              | Request to join a trip (auth required)|
| PATCH  | `/:userId`       | Update a participant info             |

### 🧑 `/user`
| Method | Endpoint        | Description             |
|--------|------------------|-------------------------|
| GET    | `/`              | Get all users           |
| GET    | `/:id`           | Get one user            |
| PATCH  | `/:id`           | Update user             |
| POST   | `/`              | Create new user         |

### 🔐 `/user/api`
| Method | Endpoint         | Description                   |
|--------|------------------|-------------------------------|
| POST   | `/login`         | Log in                        |
| POST   | `/logout`        | Log out                       |
| GET    | `/profile`       | Get current user profile (auth)|

---

---💡 Features
User authentication with login/logout

Trip creation, editing, and deletion

Join and manage trip participants

Clean and responsive UI

## 🧪 Running the Project

### 1. Clone the Repo
```bash
git clone https://github.com/yourusername/hackathon-trip-planner.git
cd hackathon-trip-planner

```
2. Setup Environment Variables
```bash
Create a .env file inside the /backend directory:

ini
Copy
Edit
DATABASE_URL=your_prisma_db_url
JWT_SECRET=your_jwt_secret
PORT=4002
```
3. Install Dependencies

```bash
Backend
bash
Copy
Edit
cd backend
npm install
npx prisma generate
Frontend
bash
Copy
Edit
cd frontend
npm install
```
5. Run the App

```bash
Start the backend:

Copy
Edit
cd backend
npm run dev
Start the frontend:

bash
Copy
Edit
cd frontend
npm start
```

💡 Features
🔒 Authentication (Login / Logout)

✍️ Create & manage trips

🧑‍🤝‍🧑 Join and manage trip participants

🌐 Fully responsive UI




