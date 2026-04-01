import { Sequelize } from 'sequelize';
import { env } from '../config/env.js';

if (!env.databaseUrl) {
  throw new Error('DATABASE_URL is not set');
}

export const sequelize = new Sequelize(env.databaseUrl, {
  dialect: 'postgres',
  logging: false,
});
