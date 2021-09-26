import express from 'express';

const app = express();
const PORT = process.env.PORT || 8000;

const storage = {};

app.get('/packages/:package_id', (req, res) => {

});

app.get('/packages', (req, res) => {

});

app.post('/packages', (req, res) => {

});

app.put('/packages/:package_id', (req, res) => {

});

app.delete('/packages/:package_id', (req, res) => {

});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});

