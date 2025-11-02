# Club & Event Management System

A full-stack web application to manage clubs and events. Clubs can register, get approved by an admin, create events with dynamic registration forms, and students can register for events. The frontend is built with React + Vite and Tailwind CSS. The backend is built with Node.js, Express, and MongoDB. The project also includes a chatbot integration which uses Google Gemini (Generative Language API) server-side.

## Features

- Club registration and approval workflow (admin approves clubs before they can add events)
- Clubs can create events with dynamic registration forms (fields defined by the club)
- Student registration for events
- Chatbot powered by Google Gemini (server-side, via `GEMINI_API_KEY`)
- File uploads for event posters and club logos (Cloudinary integration)
- Email notifications (SMTP / Nodemailer)

## Repo structure

- `backend/` - Express API, MongoDB models, controllers, routes
- `frontend/` - React app (Vite) with Tailwind CSS and components

## Prerequisites

- Node.js (v18+ recommended)
- npm
- MongoDB instance (local or Atlas)
- (Optional) Cloudinary account for image uploads
- (Optional) Google Gemini API key for chatbot (recommended to store server-side)

## Environment variables

Create a `.env` file in the `backend/` folder with the following (example):

```
PORT=3000
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/clubdb?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_here
GEMINI_API_KEY=your_google_gemini_api_key_here

# Cloudinary (if used for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Email (if email notifications used)
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=your_email_user
EMAIL_PASS=your_email_password
```

Important: Never commit `.env` or secret keys to source control.

## Backend - Setup & Run

1. Install dependencies

```powershell
cd backend
npm install
```

2. Ensure your `.env` is configured as above.

3. Start the server

```powershell
node index.js
# or use nodemon if installed for automatic restarts
npx nodemon index.js
```

The backend runs on port `3000` by default (see `backend/index.js`).

### Notes about the chatbot

- The server route `POST /api/chat/chat` calls Google Gemini only when `GEMINI_API_KEY` is present. Make sure to set it in `backend/.env`.
- The key remains server-side; the frontend posts user messages to `/api/chat/chat` and receives the assistant reply.
- For production, consider using Google service accounts / Vertex AI with workload identity instead of an API key.

## Frontend - Setup & Run

1. Install dependencies

```powershell
cd frontend
npm install
```

2. Start the dev server

```powershell
npm run dev
```

By default Vite serves the frontend at `http://localhost:5173` (or the port reported in the terminal).

## Important Routes (API)

- `POST /api/chat/chat` - Chatbot endpoint. Accepts `messages` array in the request body.
- `GET /api/clubs/getevents` - Fetch events (example; see backend routes for full list)
- Authentication & club/student routes are under `/api/admin`, `/api/student`, `/api/clubs`

Refer to `backend/routes/` for complete route definitions.

## Frontend notes

- The `role` is stored in `localStorage` to toggle UI between `student` and `club` modes (e.g., show `Add Event` link).
- Tailwind is included as a dependency; styles live in `frontend/src/index.css` and components use Tailwind classes.

## Testing

There are no automated tests included. For manual testing:

- Register a club, inspect the admin dashboard to approve the club, then log in as the club to create events.
- As a student, try registering for events. Ensure `localStorage` role is set to `student` when testing the register flow.

## Deployment

- Host the backend on any Node-friendly host (Heroku, Railway, Render, or your VPS). Ensure environment variables are set on the host.
- Host the frontend as a static site (Vercel, Netlify) after building with `npm run build`. Update API base URLs accordingly.

## Security & Production Considerations

- Move from API keys to proper service account / Vertex AI authentication for Gemini in production.
- Use HTTPS in production and secure environment variable storage.
- Add rate-limiting / authentication and validate inputs server-side.
