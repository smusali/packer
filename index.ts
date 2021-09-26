import express from 'express';
import bodyParser from 'body-parser';

import {Packages} from './endpoints/packages';

const PORT: number = Number(process.env.PORT) || 8000;
const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.post('/packages', Packages.create);
app.get('/packages', Packages.list);
app.delete('/packages/:id', Packages.remove);
app.get('/packages/:id', Packages.retrieve);
app.put('/packages/:id', Packages.update);

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
