import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import healthRoutes from './routes/health';
import translationRoutes from './routes/translations';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', healthRoutes);
app.use('/api', translationRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`API server listening on http://localhost:${port}`);
});
