// controllers/AuthController.js

const { response } = require('express');
const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');
const { v4: uuidv4 } = require('uuid');

class AuthController {
  static async getConnect(req, res) {
    // Extract email and password from the Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Decode and extract email and password from the Basic auth header
    const credentials = Buffer.from(authHeader.split(' ')[1], 'base64').toString('utf-8').split(':');
    const email = credentials[0];
    const password = credentials[1];

    try {
      // Find the user associated with the email and password
      const user = await dbClient.getUser(email, password);

      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Generate a random token using uuidv4
      const token = uuidv4();

      // Create a key: auth_<token> and store the user ID in Redis for 24 hours
      await redisClient.client.set(`auth_${token}`, user._id.toString(), 'EX', 24 * 60 * 60);

      // Return the token with a status code 200
      return res.status(200).json({ token });
    } catch (error) {
      // Handle any errors and return a 500 status code
      console.error(`Error in getConnect: ${error}`);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getDisconnect(req, res) {
    // Extract the token from the X-Token header
    const token = req.headers['x-token'];

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      // Retrieve the user based on the token
      const userId = await redisClient.client.get(`auth_${token}`);

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Delete the token in Redis and return nothing with a status code 204
      await redisClient.client.del(`auth_${token}`);
      return res.status(204).end();
    } catch (error) {
      // Handle any errors and return a 500 status code
      console.error(`Error in getDisconnect: ${error}`);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = AuthController;
