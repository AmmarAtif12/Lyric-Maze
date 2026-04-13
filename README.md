# Lyric Maze 🎮🎵

A web-based puzzle game that combines maze navigation with music trivia. Guide your character through procedurally generated mazes, answer lyric-based quiz questions to unlock doors, and compete for the highest score on the leaderboard.

## Features

- **Maze Navigation** — Explore procedurally generated mazes with keyboard or touch controls
- **Lyric Quizzes** — Answer music trivia questions at locked doors to progress
- **Scoring System** — Earn points for correct answers, speed bonuses, and maze completion
- **Leaderboard** — Compete globally with persistent high-score tracking
- **Multiple Difficulty Levels** — Easy, Medium, and Hard mazes with matching question difficulty
- **Responsive Design** — Play on desktop or mobile

## Tech Stack

| Layer      | Technology                  |
| ---------- | --------------------------- |
| Frontend   | React, Vite, Phaser         |
| Backend    | Node.js, Express            |
| Database   | Firebase Firestore          |
| Auth       | Firebase Authentication     |
| Lyrics API | Genius API                  |
| Hosting    | Firebase Hosting / Vercel   |

## Getting Started

### Prerequisites

- Node.js ≥ 18
- npm or yarn
- A Firebase project
- A Genius API client access token

### Installation

```bash
# Clone the repository
git clone https://github.com/<your-username>/Lyric-Maze.git
cd Lyric-Maze

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

### Environment Variables

Create a `.env` file in both the `frontend/` and `backend/` directories.

**frontend/.env**

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

**backend/.env**

```
PORT=5000
NODE_ENV=development
GENIUS_API_KEY=your_genius_api_key
FIREBASE_PROJECT_ID=your_firebase_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY=your_firebase_private_key
FRONTEND_URL=http://localhost:5173
```

### Running the Dev Servers

```bash
# Start the backend
cd backend
npm run dev

# In a separate terminal, start the frontend
cd frontend
npm run dev
```

The frontend dev server will be available at `http://localhost:5173` and the backend at `http://localhost:5000`.

## API Endpoints

| Method | Endpoint                  | Description                          |
| ------ | ------------------------- | ------------------------------------ |
| POST   | `/api/auth/signup`        | User registration                    |
| POST   | `/api/auth/login`         | User login                           |
| GET    | `/api/lyrics/:artist`     | Fetch lyrics for an artist           |
| GET    | `/api/lyrics/quiz/:artist`| Generate a quiz question for artist  |
| POST   | `/api/scores`             | Save a game score                    |
| GET    | `/api/scores/leaderboard` | Get top scores                       |
| GET    | `/api/users/:userId`      | Get user profile                     |
| PUT    | `/api/users/:userId`      | Update user profile                  |
| GET    | `/api/health`             | Health check                         |

## Project Structure

```
Lyric-Maze/
├── frontend/               # React + Vite + Phaser client
│   ├── src/
│   │   ├── components/     # React UI components
│   │   │   ├── MazeGame.jsx
│   │   │   ├── LyricQuiz.jsx
│   │   │   ├── ArtistSetup.jsx
│   │   │   ├── Leaderboard.jsx
│   │   │   └── Auth.jsx
│   │   ├── utils/          # Game logic & API helpers
│   │   │   ├── mazeGenerator.js
│   │   │   ├── collisionDetection.js
│   │   │   ├── gameLogic.js
│   │   │   └── api.js
│   │   ├── styles/         # CSS stylesheets
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── firebase.js
│   ├── index.html
│   ├── vite.config.js
│   ├── .env.example
│   └── package.json
├── backend/                # Express API server
│   ├── routes/             # Express route handlers
│   ├── controllers/        # Request handlers
│   ├── middleware/          # Auth middleware
│   ├── services/           # Genius API integration
│   ├── models/             # Seed data
│   ├── server.js
│   ├── .env.example
│   └── package.json
├── .gitignore
├── CONTRIBUTING.md
└── README.md
```

## MVP Scope — Phase 1

- Procedurally generated maze with arrow-key navigation
- 3 pre-loaded test artists (The Weeknd, Drake, Ariana Grande) with 5 songs each
- Lyric-based multiple-choice quizzes appearing at random intervals
- Combo scoring system with multiplier for consecutive correct answers
- Wrong answer penalty: player pushed back 5 blocks
- Global leaderboard stored in Firebase Firestore
- User authentication via Firebase (email/password)
- Retro/8-bit aesthetic with neon color palette
- Playable on modern desktop browsers

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to get started.

## License

This project is licensed under the MIT License.