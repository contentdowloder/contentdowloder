import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import authRoutes from './routes/auth.js';
import fetchRoutes from './routes/fetch.js';
import { authMiddleware } from './middleware/auth.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

// Middlewares
app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));
app.use(express.static('public'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/fetch', authMiddleware, fetchRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
