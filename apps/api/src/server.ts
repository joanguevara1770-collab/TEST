import cors from 'cors';
import express from 'express';
import { config } from './config.js';
import { router } from './routes.js';

const app = express();
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());
app.use('/api', router);

app.listen(config.port, () => {
  console.log(`API running on http://localhost:${config.port}`);
});
