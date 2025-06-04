const express = require('express');
const cors = require('cors');
const path = require('path');
const data = require('../data.json');

const app = express();

// Configure CORS
app.use(cors({
  origin: 'http://localhost:5173', // Vite's default port
  credentials: true
}));

app.use(express.json());

// API routes
app.get('/api/users', (req, res) => res.json(data.users));
app.get('/api/receipts', (req, res) => res.json(data.receipts));
app.get('/api/rewards', (req, res) => res.json(data.rewards));
app.get('/api/metrics', (req, res) => res.json(data.metrics));
app.post('/api/admin/users/:id/points', (req, res) => {
  const { id } = req.params;
  const { points } = req.body;
  const user = data.users.find(u => u.id === id);
  if (!user || points < 0) {
    return res.status(400).json({ error: 'Invalid user or points' });
  }
  user.points = points;
  res.json(user);
});

// Reward redemption endpoint
app.post('/api/rewards/:rewardId/redeem', (req, res) => {
  const { rewardId } = req.params;
  const { userId } = req.body;
  
  const user = data.users.find(u => u.id === userId);
  const reward = data.rewards.find(r => r.id === rewardId);
  
  if (!user || !reward) {
    return res.status(400).json({ error: 'Invalid user or reward' });
  }
  
  if (user.points < reward.pointsCost) {
    return res.status(400).json({ error: 'Not enough points' });
  }
  
  user.points -= reward.pointsCost;
  res.json({ success: true, remainingPoints: user.points });
});

// Serve React build
app.use(express.static(path.join(__dirname, '../client/dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
