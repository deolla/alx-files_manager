// routes/index.js

const express = require('express');
const AppController = require('../controllers/AppController');
const UsersController = require('../controllers/UsersController');

const router = express.Router();

// Define endpoints
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);
router.post('/users', UsersController.postNew);

router.get('/connect', AppController.getConnect);
router.get('/disconnect', AppController.getDisconnect);
router.get('/users/me', AppController.getMe);

module.exports = router;
