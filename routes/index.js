import express from 'express';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';

function controllers(app) {
  const router = express.Router();
  app.use('/', router);

  router.get('/status', (req, res) => {
    AppController.getStatus(req, res);
  });

  router.get('/stats', (req, res) => {
    AppController.getStats(req, res);
  });

  // Controller for Users
  router.post('/users', (req, res) => {
    UsersController.postNew(req, res);
  });
}

export default controllers;
