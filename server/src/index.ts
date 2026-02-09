import express from 'express';
import cors from 'cors';
import { env } from './config/env';
import { errorHandler } from './middleware/errorHandler';
import applicationRoutes from './routes/applicationRoutes';
import statsRoutes from './routes/statsRoutes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/v1/applications', applicationRoutes);
app.use('/api/v1/stats', statsRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`Server running on http://localhost:${env.PORT}`);
});
