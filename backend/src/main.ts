import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import { registerRoutes } from './app.module.js';
import { auditMiddleware } from './middlewares/audit.middleware.js';
import { authMiddleware } from './middlewares/auth.middleware.js';
import { errorHandlerMiddleware } from './middlewares/error-handler.middleware.js';
import { rateLimitMiddleware } from './middlewares/rate-limit.middleware.js';

const app = express();
const port = Number(process.env.PORT ?? 38301);

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(rateLimitMiddleware);
app.use(auditMiddleware);
app.use('/api/v1', authMiddleware);

registerRoutes(app);

app.use(errorHandlerMiddleware);

app.listen(port, () => {
  console.log(`SupplyChain Hub API listening on ${port}`);
});
