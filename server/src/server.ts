import { app } from './app';
import { logger } from './config/logger';

const port = process.env.HTTP_PORT || 3002;

app.listen(port, () => {
  logger.info(`Server listening on port ${port}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
