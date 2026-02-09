import dotenv from 'dotenv';
dotenv.config();

export const env = {
  DB_HOST: process.env.DB_HOST || 'localhost',
  DB_PORT: parseInt(process.env.DB_PORT || '3306'),
  DB_USER: process.env.DB_USER || 'root',
  DB_PASSWORD: process.env.DB_PASSWORD || '',
  DB_NAME: process.env.DB_NAME || 'job_tracker',
  PORT: parseInt(process.env.PORT || '3001'),
};
