// this is the route that will be used to handle the requests

const express = require('express');
const AppController = require('../controllers/AppController');
const UsersController = require('../controllers/UsersController');
// const AuthController = require('../controllers/AuthController');

const router = express.Router();

router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);
router.post('/users', UsersController.postNew);

module.exports = router;
