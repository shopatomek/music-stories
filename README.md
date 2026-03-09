# Music Stories

A full-stack web application for creating and sharing music stories. Users log in with Google, then can write, edit, and delete their own stories — and browse public stories from other users.

🔗 **Live demo:** [music-stories.onrender.com](https://music-stories-4uvz.onrender.com)

---

## Tech Stack

| Layer          | Technology                      |
| -------------- | ------------------------------- |
| Runtime        | Node.js                         |
| Framework      | Express.js                      |
| Templating     | Handlebars (SSR)                |
| Database       | MongoDB Atlas + Mongoose        |
| Authentication | Passport.js + Google OAuth 2.0  |
| Sessions       | express-session + connect-mongo |
| Rich text      | CKEditor                        |
| Deployment     | Render                          |

---

## Features

- Google OAuth 2.0 login
- Create, edit and delete your own stories
- Public / private story visibility
- Browse public stories from all users
- Route protection — dashboard requires authentication
- Session persistence backed by MongoDB

---

## Local Setup

### Prerequisites

- Node.js v18+
- A [MongoDB Atlas](https://cloud.mongodb.com) account (free tier works)
- A [Google Cloud Console](https://console.cloud.google.com) project with OAuth 2.0 credentials

---

### 1. Clone the repository

```bash
git clone https://github.com/shopatomek/music-stories.git
cd music-stories
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env
```

Open `.env` and fill in your values. See the section below for how to obtain each one.

### 4. Run the app

```bash
npm run dev
```

Open [http://localhost:5000](http://localhost:5000) in your browser.

---

## Environment Variables — How to Get Each One

### `MONGO_URL` — MongoDB Atlas connection string

1. Sign up / log in at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free **Cluster**
3. Go to **Database Access** → add a user with a password
4. Go to **Network Access** → add your IP (or `0.0.0.0/0` to allow all)
5. Click **Connect** on your cluster → **Drivers** → **Node.js** → copy the connection string
6. Replace `<password>` with your database user's password

> **Node.js v24 on Windows:** If you get a `querySrv ECONNREFUSED` error with the `mongodb+srv://` format, select an older driver version in the Atlas Connect dialog to get a direct connection string with explicit hostnames and port numbers.

---

### `SESSION_SECRET` — session signing secret

Generate a secure random string in your terminal:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and paste it as the value.

---

### `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` — Google OAuth credentials

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a new project (or select an existing one)
3. Go to **APIs & Services → OAuth consent screen**
   - Choose **External**
   - Fill in app name and your email
   - Under **Test users**, add your Gmail address
4. Go to **APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client ID**
   - Application type: **Web application**
   - Authorized redirect URIs: `http://localhost:5000/auth/google/callback`
5. Copy the **Client ID** and **Client Secret**

---

### `GOOGLE_CALLBACK_URL`

For local development:

```
http://localhost:5000/auth/google/callback
```

For production (Render), change to:

```
https://your-app.onrender.com/auth/google/callback
```

---

### `NODE_ENV`

Set to `development` locally, `production` on Render.

---

## Deployment on Render

This app deploys as a monolith on [Render](https://render.com). Because it uses server-side rendering and session management, it requires a persistent server — Vercel is not suitable for this architecture.

### Steps

1. Push your code to GitHub
2. Go to [render.com](https://render.com) → **New → Web Service**
3. Connect your GitHub repository
4. Configure:

| Field         | Value         |
| ------------- | ------------- |
| Build Command | `npm install` |
| Start Command | `node index`  |
| Instance Type | Free          |

5. Add all environment variables from `.env.example` in the **Environment** tab — use your production values (update `GOOGLE_CALLBACK_URL` to your Render URL)

6. In Google Cloud Console → **Credentials** → your OAuth client → add your Render URL to **Authorized redirect URIs**:

```
https://your-app.onrender.com/auth/google/callback
```

7. Click **Deploy**

---

## Project Structure

```
music-stories/
├── config/
│   └── passport.js         # Google OAuth strategy
├── middleware/
│   └── auth.js             # ensureAuth / ensureGuest route guards
├── models/
│   ├── story.js            # Story schema
│   └── user.js             # User schema (populated from Google profile)
├── routes/
│   ├── auth.js             # /auth/google, /auth/logout
│   ├── index.js            # / (login page), /dashboard
│   └── stories.js          # CRUD: /stories
├── views/                  # Handlebars templates
│   ├── layouts/
│   ├── partials/
│   └── stories/
├── public/css/             # Stylesheet
├── helpers/hbs.js          # Custom Handlebars helpers
└── index.js                # App entry point
```

---

## License

ISC

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://github.com/shopatomek/music-stories/blob/main/LICENSE)

Copyright 2022 Tomasz Szopa
