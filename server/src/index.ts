import 'dotenv/config';
import app, { ready } from './app.js';

const PORT = process.env.PORT ?? 4000;

ready()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Hackathon dashboard API listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });
