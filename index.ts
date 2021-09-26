import express from 'express';
import bodyParser from 'body-parser';

import {Packages} from './endpoints/packages';

const PORT: number = Number(process.env.PORT) || 8000;
const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

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

const server = app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});

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
