# 🚀 HereWeGo

A full-stack web application to manage trips and participants with seamless authentication and CRUD operations. Built for a hackathon using modern technologies like React, Tailwind CSS, Node.js,Hono and Prisma.

## 🛠️ Tech Stack

### Frontend
- **React** – Component-based UI library
- **Tailwind CSS** – Utility-first CSS for fast UI development

### Backend
- **Node.js & Express** – REST API server
- **Prisma** – Modern ORM for database interaction
- **JWT Authentication** – Secure access for authenticated users

---

## 🔌 API Endpoints

### 🌍 `/trips`
- `GET /` – Get all trips
- `GET /:id` – Get a single trip by ID
- `POST /` – Create a new trip *(auth required)*
- `PATCH /:id` – Update a trip
- `DELETE /:id` – Delete a trip

### 👥 `/trip-participants`
- `GET /` – Get all trip participants
- `POST /` – Request to join a trip *(auth required)*
- `PATCH /:userId` – Update a trip participant

### 🙋 `/users`
- `GET /` – Get all users
- `GET /:id` – Get user by ID
- `PATCH /:id` – Update user
- `POST /` – Create new user

### 🔐 `/api`
- `POST /login` – Log in user
- `POST /logout` – Log out user
- `GET /profile` – Get logged-in user profile *(auth required)*

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


