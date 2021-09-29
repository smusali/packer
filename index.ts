/** Internal Dependencies */
import {app} from './config/routes';

/** Constants */
const PORT: number = Number(process.env.PORT) || 8000;

/** Start the Express Server */
const server = app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});

/** Implement Graceful Shutdown */
const gracefulShutdown = () => {
  server.close((error) => {
    if (error) {
      console.error(`⚡️[server]: Server cannot be shutting down at http://localhost:${PORT}`);
    } else {
      console.log(`⚡️[server]: Server is shutting down at http://localhost:${PORT}`);
    }
  });
};

// Graceful Shutdown Scenarios
process.once('SIGTERM', gracefulShutdown); // kill
process.once('SIGINT', gracefulShutdown); // ctrl+c
