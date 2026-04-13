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
GENIUS_API_KEY=your_genius_api_key
FIREBASE_SERVICE_ACCOUNT=path/to/serviceAccountKey.json
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

| Method | Endpoint               | Description                          |
| ------ | ---------------------- | ------------------------------------ |
| GET    | `/api/quiz`            | Fetch a random lyric quiz question   |
| GET    | `/api/quiz/:difficulty`| Fetch a question by difficulty level |
| POST   | `/api/score`           | Submit a player's score              |
| GET    | `/api/leaderboard`     | Retrieve the top scores              |
| GET    | `/api/health`          | Health check                         |

## Project Structure

```
Lyric-Maze/
├── frontend/          # React + Vite + Phaser client
│   ├── public/
│   ├── src/
│   │   ├── components/   # React UI components
│   │   ├── scenes/       # Phaser game scenes
│   │   ├── services/     # API and Firebase helpers
│   │   └── App.jsx
│   ├── .env
│   └── package.json
├── backend/           # Express API server
│   ├── src/
│   │   ├── routes/       # Express route handlers
│   │   ├── services/     # Genius API & Firebase logic
│   │   └── index.js
│   ├── .env
│   └── package.json
├── .gitignore
├── CONTRIBUTING.md
├── LICENSE
└── README.md
```

## MVP Scope — Phase 1

- Single-player maze with one difficulty level
- Basic lyric fill-in-the-blank questions sourced from the Genius API
- Simple scoring (correct answer = +100 points)
- Global leaderboard stored in Firebase Firestore
- User authentication via Firebase (email/password)
- Playable on modern desktop browsers

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to get started.

## License

This project is licensed under the [MIT License](LICENSE).