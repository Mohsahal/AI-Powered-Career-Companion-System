# Future Find Career

A full-stack career platform: resume builder, ATS evaluation, skill gap analysis, mock interviews.

## Project Structure

```
Major-project/
├── client/             # React frontend (Vite, Tailwind, Shadcn)
│   ├── src/
│   │   ├── pages/      # Home, Dashboard, Resume Builder, Skill Gap, etc.
│   │   ├── components/
│   │   ├── config/     # API URLs
│   │   └── services/   # Gemini, API client
│   └── ...
│
├── node/               # Express API (auth, resumes, interviews)
│   ├── routes/         # auth, resume, ai, interviews
│   ├── models/
│   └── ...
└── README.md
```

## Flow

1. **Client** – React app, calls the Node API (auth, resumes, AI, interviews).
2. **Node** – Auth (JWT, Google), MongoDB, Gemini-powered ATS evaluation + skill gap analysis.

## Tech Stack

| Layer    | Tech                                                  |
| -------- | ----------------------------------------------------- |
| Frontend | React 18, Vite, Tailwind, Shadcn UI                   |
| Node API | Express, MongoDB, JWT, Google Auth, Gemini            |

## Setup

### Prerequisites

- Node.js 18+, MongoDB
- API keys: Gemini, Google OAuth (YouTube key optional if you later add video suggestions)

### Install & Run

```bash
# Client
cd client && npm install
# Add client/.env: VITE_API_BASE_URL, VITE_GOOGLE_CLIENT_ID

# Node
cd node && npm install
# Add node/.env: GEMINI_API_KEY, JWT_SECRET, MONGODB_URI, GOOGLE_CLIENT_ID, PORT=1000
```

Run (2 terminals):

```bash
cd node && npm run dev         # :1000
cd client && npm run dev       # :8080
```

Open [http://localhost:8080](http://localhost:8080).

## Deployment (Render)

Deploy Node (API) and the client (static). Set env vars in your hosting dashboard (MONGODB_URI, GEMINI_API_KEY, JWT_SECRET, etc.).

## License

ISC
