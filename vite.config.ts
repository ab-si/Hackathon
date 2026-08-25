import { execSync } from 'node:child_process'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function gitShortHash() {
  // Vercel CLI deploys upload only the source tree (no .git), so `git rev-parse`
  // fails in the remote build sandbox. Prefer commit info passed in explicitly
  // (APP_COMMIT via `--build-env`, or VERCEL_GIT_COMMIT_SHA when Git-connected),
  // and fall back to reading git locally for `npm run dev` / `npm run build`.
  if (process.env.APP_COMMIT) return process.env.APP_COMMIT
  if (process.env.VERCEL_GIT_COMMIT_SHA) return process.env.VERCEL_GIT_COMMIT_SHA.slice(0, 7)
  try {
    return execSync('git rev-parse --short HEAD').toString().trim()
  } catch {
    return 'unknown'
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    __APP_COMMIT__: JSON.stringify(gitShortHash()),
    __APP_BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
})
