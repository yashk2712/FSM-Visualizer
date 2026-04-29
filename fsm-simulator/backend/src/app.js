import express from 'express';
import cors from 'cors';
import machineRoutes from './routes/machineRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/machines', machineRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`FSM Simulator Backend running on http://localhost:${PORT}`);
});
