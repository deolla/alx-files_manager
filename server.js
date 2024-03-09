// server.js

const express = require('express');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Load all routes from the file routes/index.js
app.use(routes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
