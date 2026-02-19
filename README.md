# 🌌 Anonymous Confession Wall – Anti-Gravity Edition

A full-stack MERN application where users log in with **Google OAuth 2.0**, post **anonymous confessions** with a secret code, and interact via **emoji reactions**. Features a unique **anti-gravity space theme** with floating cards!

---

## 📦 Tech Stack

| Layer          | Technology              |
| -------------- | ----------------------- |
| Frontend       | React.js + Vite         |
| Backend        | Node.js + Express.js    |
| Database       | MongoDB (Mongoose)      |
| Authentication | Google OAuth 2.0 + Passport.js |
| Styling        | Vanilla CSS (Space Theme) |

---

## 📁 Folder Structure

```
confession-wall/
├── server/                        # 🖥 Backend
│   ├── config/
│   │   ├── db.js                  # MongoDB connection
│   │   └── passport.js            # Google OAuth strategy
│   ├── models/
│   │   ├── User.js                # User schema (Google profile)
│   │   └── Confession.js          # Confession schema
│   ├── routes/
│   │   ├── auth.js                # Auth routes (login/logout/callback)
│   │   └── confessions.js         # CRUD + reaction routes
│   ├── middleware/
│   │   └── auth.js                # ensureAuth middleware
│   ├── server.js                  # Express entry point
│   ├── package.json
│   └── .env.example               # Environment variable template
│
├── client/                        # ⚛ Frontend (React)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx         # Navigation + toggle + login
│   │   │   ├── ConfessionForm.jsx # Submit confession form
│   │   │   ├── ConfessionCard.jsx # Single confession display
│   │   │   ├── ConfessionWall.jsx # List of all confessions
│   │   │   ├── SecretCodeModal.jsx# Secret code prompt popup
│   │   │   └── StarryBackground.jsx # Animated stars
│   │   ├── pages/
│   │   │   ├── Home.jsx           # Main page
│   │   │   └── Login.jsx          # Login landing page
│   │   ├── App.jsx                # Root component + routing
│   │   ├── main.jsx               # React entry point
│   │   └── index.css              # Anti-gravity space theme
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── README.md
```

---

## 🚀 Installation Steps

### Prerequisites
- **Node.js** (v18+) – [Download](https://nodejs.org/)
- **MongoDB** – Local install OR [MongoDB Atlas](https://www.mongodb.com/atlas) free cluster
- **Google Cloud Console** account for OAuth credentials

### Step 1: Clone / Navigate to the project
```bash
cd confession-wall
```

### Step 2: Set up the Backend

```bash
cd server
npm install
```

Create a `.env` file (copy from `.env.example`):
```bash
copy .env.example .env
```

Edit `server/.env` with your values:
```env
MONGO_URI=mongodb://localhost:27017/confession-wall
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SESSION_SECRET=any_random_secret_string_here
PORT=5000
CLIENT_URL=http://localhost:5173
```

### Step 3: Set up the Frontend

```bash
cd ../client
npm install
```

### Step 4: Start both servers

**Terminal 1 – Backend:**
```bash
cd server
npm run dev
```
Server runs on `http://localhost:5000`

**Terminal 2 – Frontend:**
```bash
cd client
npm run dev
```
React app runs on `http://localhost:5173`

---

## 🔧 Google OAuth 2.0 Setup (Required)

### How to get Google OAuth Credentials:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select an existing one)
3. Go to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth Client ID**
5. Select **Web application**
6. Add **Authorized redirect URIs**:
   ```
   http://localhost:5000/auth/google/callback
   ```
7. Copy the **Client ID** and **Client Secret** to your `server/.env` file

### How Google OAuth Works in This App:

```
User clicks "Login with Google"
         │
         ▼
React → GET /auth/google
         │
         ▼
Express redirects to Google Consent Screen
         │
         ▼
User grants permission on Google
         │
         ▼
Google redirects to GET /auth/google/callback
         │
         ▼
Passport.js exchanges auth code for user profile
         │
         ▼
Find or create user in MongoDB
         │
         ▼
Session created → User is logged in!
         │
         ▼
Redirect back to React app (/)
```

---

## 🔒 How Secret Code Verification Works

Each confession has a **secret code** that acts like a password for editing/deleting:

### Creating a Confession:
1. User enters confession text + secret code
2. **bcrypt** hashes the code with salt (10 rounds)
3. The **hashed** code is stored in MongoDB (never plain text!)

### Editing/Deleting:
1. User clicks Edit/Delete → modal asks for secret code
2. User enters the plain-text code
3. Backend uses `bcrypt.compare(inputCode, storedHash)`
4. If match → operation allowed ✅
5. If no match → "Wrong secret code!" error ❌

**Why bcrypt?** Even if someone accesses the database, they can't see the actual codes because they're one-way hashed.

---

## 🌌 Anti-Gravity UI Features

| Feature                | Description                                    |
| ---------------------- | ---------------------------------------------- |
| Starry Background      | 150+ animated twinkling stars + shooting stars |
| Floating Cards         | CSS `@keyframes float` with random durations   |
| Glassmorphism          | `backdrop-filter: blur()` on cards/forms       |
| Glowing Buttons        | `box-shadow` glow effects on hover             |
| Emoji Burst            | Flying reaction emojis on click                |
| Mode Toggle            | Switch between Normal and Anti-Gravity mode    |
| Responsive Design      | Works on mobile and desktop                    |

---

## 📡 API Endpoints

| Method | Endpoint                      | Description              | Auth Required |
| ------ | ----------------------------- | ------------------------ | ------------- |
| GET    | `/auth/google`                | Start Google login       | No            |
| GET    | `/auth/google/callback`       | Google callback          | No            |
| GET    | `/auth/logout`                | Logout user              | No            |
| GET    | `/auth/current_user`          | Get logged-in user       | No            |
| POST   | `/api/confessions`            | Create confession        | Yes           |
| GET    | `/api/confessions`            | Get all confessions      | No            |
| PUT    | `/api/confessions/:id`        | Edit (needs secret code) | No            |
| DELETE | `/api/confessions/:id`        | Delete (needs secret code)| No           |
| POST   | `/api/confessions/:id/react`  | Add reaction             | No            |

---

## 🎓 Viva Quick Reference

**Q: What is the tech stack?**
A: MERN – MongoDB, Express.js, React.js, Node.js, with Google OAuth via Passport.js.

**Q: How is anonymity maintained?**
A: Confessions don't display user info. Only the Google user ID is stored internally for reference.

**Q: How does edit/delete work without login?**
A: A secret code (entered during posting) is hashed with bcrypt. To edit/delete, the user must provide the same code, which is verified against the hash.

**Q: What makes the UI anti-gravity?**
A: CSS `@keyframes float` animation with random durations makes cards hover. A starry background with twinkling and shooting star animations creates the space effect. Glassmorphism and glow effects complete the theme.

---

## 📝 License

This project is for educational purposes (college viva / minor project demonstration).
