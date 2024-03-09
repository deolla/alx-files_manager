const express = require('express');
const redisClient = require('./utils/redis');
const dbClient = require('./utils/db');
const routes = require('./routes');

const app = express();

app.use(express.json());
app.use('/api', routes);

app.listen(process.env.PORT || 5000, async () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
  await redisClient.isAlive();
  await dbClient.isAlive();
});