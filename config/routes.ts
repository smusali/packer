/** External Dependencies */
import bodyParser from 'body-parser';
import express, {Application} from 'express';

/** Internal Dependencies */
import {Packages} from '../endpoints/packages';
import {info} from '../endpoints/info';

/** Initialize Express App */
export const app: Application = express();

/** Use the bodyParser Plugin */
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

/** Define the Routes */
app.post('/packages', Packages.create);
app.get('/packages/example', Packages.example);
app.get('/packages', Packages.list);
app.delete('/packages/:id', Packages.remove);
app.get('/packages/:id', Packages.retrieve);
app.put('/packages/:id', Packages.update);
app.get('/info', info);
app.get('/', (req, res) => {
  res.redirect('/info');
});
