import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();
const users = {}; // in-memory store

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (users[email]) return res.status(400).json({ message: 'User exists' });
  const hashed = await bcrypt.hash(password, 10);
  users[email] = { email, password: hashed };
  const token = jwt.sign({ email }, process.env.SESSION_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users[email];
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ email }, process.env.SESSION_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

export default router;
