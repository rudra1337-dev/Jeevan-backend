
# Jeevan-backend
⚙ jeevan-backend Jeevan’s Node.js + Express backend securely processes emergency requests, manages authentication, and delivers real-time updates via Socket.IO. Using MongoDB for data storage, it ensures fast, reliable, and secure communication between citizens and emergency services. ⏱🛡
=======

# 🚨 IAFT Backend (Express + MongoDB + JWT)

Robust Node/Express API for IAFT — supports **citizens** and **members** with JWT auth, profile management, and emergency request workflows.

<p align="left">
  <a href="#"><img alt="Node" src="https://img.shields.io/badge/Node-18%2B-339933?logo=node.js&logoColor=white"></a>
  <a href="#"><img alt="Express" src="https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white"></a>
  <a href="#"><img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-6.x-47A248?logo=mongodb&logoColor=white"></a>
  <a href="#"><img alt="License" src="https://img.shields.io/badge/License-MIT-blue"></a>
</p>

---

## 🌳 Project Structure

backend/ ├─ config/ │  └─ db.js ├─ middleware/ │  └─ authMiddleware.js ├─ models/ │  ├─ User.js │  └─ Request.js ├─ routes/ │  ├─ authRoutes.js         # /api/auth/signup, /api/auth/signin │  ├─ profileRoutes.js      # /api/profile (GET) │  ├─ profileUpdateRoutes.js# /api/profile/update (PUT) │  ├─ requestSubmitRoutes.js# /api/request/form (POST) │  ├─ requestHistory.js     # /api/request/history (GET) │  └─ allRequestHistory.js  # /api/request/all-history (GET, member/admin) ├─ server.js ├─ .env ├─ .gitignore └─ README.md

---

## ⚙️ Requirements

- **Node.js** 18+  
- **MongoDB** (local or MongoDB Atlas)  
- **npm** or **yarn**

---

## 🔐 Environment Variables

Create a `.env` at the project root:

```bash
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/iaft
JWT_SECRET=change_this_to_a_long_random_string

> Generate a strong secret:
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"



(Optionally keep a public .env.example without secrets.)


---

🧩 Install & Run

# from backend/
npm install

# dev (auto-reload with nodemon)
npm run dev

# prod
npm start

Default server: http://localhost:5000


---

🔑 Authentication Flow (JWT)

Signup → returns JWT (30d)

Signin → returns JWT (30d)

Protected routes require Authorization: Bearer <token>



---

📚 API Reference

Base URL: http://localhost:5000

1) Auth

POST /api/auth/signup

Create a user (citizen or member).

Body

{
  "name": "John Member",
  "adhar": "1234-5678-9012",
  "age": 28,
  "bloodGroup": "O+",
  "gender": "Male",
  "phone": "9876543210",
  "relativePhone": "9123456789",
  "email": "john.member@example.com",
  "location": "Bhubaneswar, Odisha",
  "role": "member",
  "password": "securePass123"
}

Response

{
  "message": "User registered successfully",
  "token": "JWT_TOKEN",
  "user": { "name": "John Member", "role": "member", "email": "john.member@example.com" }
}

POST /api/auth/signin

Body

{ "email": "john.member@example.com", "password": "securePass123" }

Response

{ "token": "JWT_TOKEN", "payload": { "name": "John Member", "role": "member", "email": "john.member@example.com" } }


---

2) Profile

GET /api/profile

Headers

Authorization: Bearer <JWT_TOKEN>

Response

{
  "_id": "...",
  "name": "John Member",
  "email": "john.member@example.com",
  "role": "member",
  "...": "other fields without password"
}

PUT /api/profile/update

Update allowed fields (e.g., location, phone, photo).

Headers

Authorization: Bearer <JWT_TOKEN>

Body (example)

{ "location": "Cuttack, Odisha", "phone": "9988776655" }


---

3) Requests

POST /api/request/form

Create a new assistance request.

Headers

Authorization: Bearer <JWT_TOKEN>

Body

{
  "why": "Road accident",
  "what": "Need ambulance and police",
  "where": "NH16, Bhubaneswar",
  "priority": "critical"
}

GET /api/request/history

Returns requests created by the current user.

Headers

Authorization: Bearer <JWT_TOKEN>

GET /api/request/all-history

Returns all requests (restricted to member/admin as per your RBAC).

Headers

Authorization: Bearer <JWT_TOKEN>


---

🧪 Quick Testing (HTTPie)

> Replace $TOKEN with the latest JWT.



# Signup (member)
http POST :5000/api/auth/signup \
  name="John Member" adhar="1234-5678-9012" age:=28 bloodGroup="O+" gender="Male" \
  phone="9876543210" relativePhone="9123456789" email="john.member@example.com" \
  location="Bhubaneswar, Odisha" role="member" password="securePass123"

# Signin
http POST :5000/api/auth/signin email="john.member@example.com" password="securePass123"

# Profile (GET)
http GET :5000/api/profile Authorization:"Bearer $TOKEN"

# Profile (UPDATE)
http PUT :5000/api/profile/update Authorization:"Bearer $TOKEN" \
  location="Cuttack, Odisha" phone="9988776655"

# Create Requests
http POST :5000/api/request/form Authorization:"Bearer $TOKEN" \
  why="Road accident" what="Need ambulance" where="NH16 Bhubaneswar" priority="critical"

http POST :5000/api/request/form Authorization:"Bearer $TOKEN" \
  why="Fire" what="Need fire brigade" where="Cuttack Market" priority="high"

# My Request History
http GET :5000/api/request/history Authorization:"Bearer $TOKEN"

# All Request History (member/admin)
http GET :5000/api/request/all-history Authorization:"Bearer $TOKEN"


---

🛡️ Security Checklist (Recommended)

Use helmet for secure headers:

npm i helmet

const helmet = require('helmet');
app.use(helmet());

Add rate limiting (e.g., signin/signup endpoints):

npm i express-rate-limit

const rateLimit = require('express-rate-limit');
app.use('/api', rateLimit({ windowMs: 15*60*1000, max: 100 }));

Validate & sanitize inputs with express-validator (already used).

Store secrets in .env (never commit) and rotate JWT_SECRET periodically.

Use MongoDB Atlas with IP allowlists and a dedicated DB user.

Enforce RBAC for /api/request/all-history (member/admin only).



---

🚀 Deploy (Free-Friendly)

Backend: Render / Railway

Database: MongoDB Atlas

Frontend: Vercel / Netlify


Set environment variables in your host dashboard to match .env.


---

🧰 Troubleshooting

Cannot find module '../models/User'
Ensure path & filename case match exactly (User.js vs user.js), especially on Linux/Termux.

Invalid token / No token provided
Send Authorization: Bearer <token> header; ensure token not expired.

Cannot POST /api/request/form
Confirm route is mounted:
app.use("/api/request/form", RequestSubmit) or use /api/requests consistently.



---

📄 License

MIT — use freely, attribute appreciated.


---

🙌 Credits

Built with ❤️ using Node.js, Express, and MongoDB.
Members can view global requests; citizens can view their own.
