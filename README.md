# 14 Trees Hackathon Dashboard

A single-page dashboard for tracking a 12-hour hackathon in real time: countdown header,
team member cards, an editable task board with one-click status actions, a milestone
timeline, workload summary, a wins log, and a parking lot for postponed ideas.

## Stack

- Frontend: React + Vite + TypeScript + Material UI
- Backend (optional): Express + Mongoose (MongoDB)

The frontend works standalone with `localStorage` persistence. If the backend is running,
it syncs to MongoDB instead — the header shows a **Live**/**Offline** chip indicating which
mode is active.

## Frontend

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```

Optional: copy `.env.example` to `.env` and set `VITE_API_URL` if the backend runs on a
non-default host/port (defaults to `http://localhost:4000/api`).

## Backend (MongoDB persistence)

```bash
cd server
npm install
cp .env.example .env   # set MONGO_URI to your local/Atlas MongoDB instance
npm run dev             # http://localhost:4000
```

On first boot, the server seeds the initial task list and parking lot into MongoDB if the
collections are empty. There is no authentication on the API — it's intended for local/team
use during the hackathon only.

### API

| Method | Route                    | Description              |
| ------ | ------------------------ | ------------------------- |
| GET    | `/api/tasks`              | List all tasks            |
| PATCH  | `/api/tasks/:taskId`      | Update a task             |
| GET    | `/api/wins`                | List wins, newest first   |
| POST   | `/api/wins`                | Add a win                 |
| GET    | `/api/parking-lot`         | List parking lot items    |
| POST   | `/api/parking-lot`         | Add a parking lot item    |
| DELETE | `/api/parking-lot/:id`     | Remove a parking lot item |

## Keyboard shortcuts

- `/` — focus task search
- `N` — focus "add a win" input
- `D` — toggle dark mode
