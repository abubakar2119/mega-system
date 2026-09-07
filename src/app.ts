import express from "express";

const app = express();

// Middleware
app.use(express.json());

// Route
app.get('/health', async (req, res) => {
  return res.send({
    status: 'ok',
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

export default app;