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

### Using a remote MongoDB

`connectDB()` (`server/src/db.ts`) just passes `MONGO_URI` straight to Mongoose, so pointing
at a remote database is a config change, not a code change.

1. **Get your connection string.**
   - Atlas:
     ```
     mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/hackathon-july?retryWrites=true&w=majority
     ```
   - Self-hosted remote server:
     ```
     mongodb://<username>:<password>@<host>:<port>/hackathon-july
     ```

2. **Set it in `server/.env`:**
   ```bash
   cd server
   cp .env.example .env   # if you haven't already
   ```
   Edit `MONGO_URI` to the string above. Keep a database name (e.g. `hackathon-july`) at the
   end of the path — that's the database the app reads/writes.

3. **Network access** — for Atlas, allow-list your current IP (or `0.0.0.0/0` for hackathon
   convenience) under Network Access in the Atlas dashboard, or the connection will hang/timeout.

4. **Restart the backend** (`npm run dev`). It seeds the initial data into that remote DB on
   first connect if the collections are empty, same as local.

Notes:
- `server/.env` is gitignored — it will hold credentials, so it's never committed.
- If teammates each run their own `server/` pointed at the same remote `MONGO_URI`, everyone
  shares one live board, which is usually what you want during the hackathon.

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
