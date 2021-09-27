/** External Dependencies */
import express from 'express';
import bodyParser from 'body-parser';

/** Internal Dependencies */
import {Packages} from './endpoints/packages';

/** Constants */
const PORT: number = Number(process.env.PORT) || 8000;

/** Initialize Express App */
const app = express();

/** Use the bodyParser Plugin */
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

/** Define the Routes */
app.post('/packages', Packages.create);
app.get('/packages/example', Packages.example);
app.get('/info', Packages.info);
app.get('/packages', Packages.list);
app.delete('/packages/:id', Packages.remove);
app.get('/packages/:id', Packages.retrieve);
app.put('/packages/:id', Packages.update);
app.get('/', (req, res) => {
  res.redirect('/info');
});

/** Start the Express Server */
const server = app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});

/** Implement Graceful Shutdown */
const gracefulShutdown = () => {
  server.close((error) => {
    if (error) {
      console.error(`⚡️[server]: Server cannot be shutting down at https://localhost:${PORT}`);
    } else {
      console.log(`⚡️[server]: Server is shutting down at https://localhost:${PORT}`);
    }
  });
};

// Graceful Shutdown Scenarios
process.once('SIGTERM', gracefulShutdown); // kill
process.once('SIGINT', gracefulShutdown); // ctrl+c
