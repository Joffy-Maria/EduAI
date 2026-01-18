import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import connectDB from './db';

dotenv.config();

connectDB();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(helmet());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('AMLGP API is running');
});

import authRoutes from './routes/authRoutes';
import lessonRoutes from './routes/lessonRoutes';

// Routes will be imported here
app.use('/api/auth', authRoutes);
app.use('/api/lessons', lessonRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
