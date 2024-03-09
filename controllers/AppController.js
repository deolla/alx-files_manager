// controllers/AppController.js

const { response } = require('express');
const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');

class AppController {
  static async getStatus(req, res) {
    // Check if Redis and MongoDB are alive
    const redisAlive = await redisClient.isAlive();
    const dbAlive = await dbClient.isAlive();

    const status = {
      redis: redisAlive,
      db: dbAlive,
    };

    // Return status with a status code 200
    res.status(200).json(status);
  }

  static async getStats(req, res) {
    try {
      // Get the number of users and files from the database
      const usersCount = await dbClient.nbUsers();
      const filesCount = await dbClient.nbFiles();

      const stats = {
        users: usersCount,
        files: filesCount,
      };

      // Return stats with a status code 200
      res.status(200).json(stats);
    } catch (error) {
      // Handle any errors and return a 500 status code
      console.error(`Error in getStats: ${error}`);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = AppController;
