import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { errorHandler } from './middlewares/error-handler';
import { logger } from './config/logger';

import authRouter from './routes/auth-router';
import patientRouter from './routes/patient-router';
import doctorRouter from './routes/doctor-router';
import appointmentRouter from './routes/appointment-router';
import secretaryRouter from './routes/secretary-router';
import availabilityRouter from './routes/availability-router';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const app = express();

const allowedOrigins = process.env.CORS_ORIGIN?.split(',').map((origin: string) => origin.trim()) || [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
  'http://localhost:5174',
];

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/v1/auth', authRouter);
app.use('/v1/patients', patientRouter);
app.use('/v1/doctors', doctorRouter);
app.use('/v1/appointments', appointmentRouter);
app.use('/v1/secretaries', secretaryRouter);
app.use('/v1/availability', availabilityRouter);

app.use(errorHandler);

export default app;
