import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const distDir = join(__dirname, '..', 'dist');

const app = express();
const PORT = process.env.PORT || 3000;

// API
app.get('/api/hello', (_req, res) => {
  res.json({ message: 'Hello World from Express! 🚀' });
});

// Serve built React app (static files)
app.use(express.static(distDir));

// SPA fallback
app.get('*', (_req, res) => {
  res.sendFile(join(distDir, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running → http://localhost:${PORT}`);
});
