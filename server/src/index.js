import { app } from './app.js';
import { env } from './config/env.js';
import { sequelize } from './db/sequelize.js';
import './models/index.js';

const start = async () => {
  await sequelize.authenticate();
  await sequelize.sync();

  app.listen(env.port, () => {
    console.log(`Server started on http://localhost:${env.port}`);
  });
};

start().catch((error) => {
  console.error('Failed to start server', error);
  process.exit(1);
});
