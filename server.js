const express = require('express');
const appController = require('./controllers/AppController');
const routes = require('./routes');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use('/', routes);

app.get('/status', appController.getStatus);
app.get('/stats', appController.getStats);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});