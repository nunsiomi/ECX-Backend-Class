# 🎟️ Event Booking API

A RESTful Event Booking API built with **Node.js**, **Express**, **PostgreSQL**, and **Prisma ORM**.  
The API supports role-based access control for **Organizers** and **Attendees**, allowing event creation, updates, and bookings with JWT authentication.

🌐 **Live API URL:**  
https://ecx-backend-class.onrender.com

📄 **Swagger Documentation:**  
https://ecx-backend-class.onrender.com/docs

---

## 🚀 Features

- 🔐 JWT Authentication (Login/Register)
- 👤 Role-Based Authorization
  - Organizer
  - Attendee
- 📅 Event Management
  - Create Event (Organizer only)
  - Update Event (Organizer only)
  - Delete Event (Organizer only)
  - List Events (Public)
  - View Single Event
- 🎫 Event Booking (Attendee only)
- 📄 Pagination Support
- 📦 PostgreSQL Database Integration
- ⚙️ Prisma ORM
- 📘 Swagger API Documentation
- ☁️ Deployed on Render

---

## 🛠️ Tech Stack

| Technology | Description |
|------------|-------------|
| Node.js | Runtime Environment |
| Express.js | Backend Framework |
| PostgreSQL | Relational Database |
| Prisma ORM | Database ORM |
| JWT | Authentication |
| Swagger | API Documentation |
| Render | Deployment Platform |

---

## 📂 Project Structure

event-booking-api/
│
├── prisma/
│ ├── schema.prisma
│
├── src/
│ ├── controllers/
│ ├── routes/
│ ├── middleware/
│ ├── utils/
│ ├── app.js
│ └── server.js
│
├── .env.example
├── package.json
└── README.md


---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

PORT=4000
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?schema=public"
JWT_SECRET="your_jwt_secret"
JWT_EXPIRES_IN="7d"


---

## 🧪 Running Locally

### 1️⃣ Clone the repository

git clone https://github.com/nunsiomi/ECX-Backend-Class.git

cd ECX-Backend-Class/event-booking-api


### 2️⃣ Install dependencies
npm install


### 3️⃣ Generate Prisma Client
npx prisma generate

### 4️⃣ Run migrations
npx prisma migrate dev --name init

### 5️⃣ Start development server
npm run dev

API should now run on:

http://localhost:4000/


---

## 📬 API Endpoints

### 🔐 Authentication

| Method | Endpoint | Description |
|--------|----------|--------------|
| POST | /auth/register | Register User |
| POST | /auth/login | Login User |

---

### 📅 Events

| Method | Endpoint | Access |
|--------|----------|--------|
| GET | /events | Public |
| GET | /events/:id | Public |
| POST | /events | Organizer |
| PATCH | /events/:id | Organizer |
| DELETE | /events/:id | Organizer |

---

### 🎫 Booking

| Method | Endpoint | Access |
|--------|----------|--------|
| POST | /events/:id/book | Attendee |
| GET | /events/:id/bookings | Organizer |

---

## 🔑 Authorization

Use JWT token in request header:

Authorization: Bearer <your_token>

---

## 📄 Pagination

GET /events?page=1&limit=10


---

## ☁️ Deployment

The application is deployed on **Render**.

Prisma migrations are automatically applied on startup using:

prisma migrate deploy

---

## 📘 Swagger Documentation

Visit:
/
docs


to explore and test endpoints interactively.

---

## 👤 Author

**Nunsi Shiaki**  
Backend Developer | Machine Learning Engineer

---

## 📄 License

ISC License


