// controllers/UsersController.js

const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;
    if (!email) {
      res.status(400).json({ error: 'Missing email' });
      res.end();
      return;
    }
    if (!password) {
      res.status(400).json({ error: 'Missing password' });
      res.end();
      return;
    }
    const userExist = await dbClient.userExist(email);
    if (userExist) {
      res.status(400).json({ error: 'Already exist' });
      res.end();
      return;
    }
    const clients = await dbClient.createUser(email, password);
    const id = `${clients.insertedId}`;
    res.status(201).json({ id, email });
    res.end();
  }

  static async getMe(req, res) {
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

      // Retrieve the user object (email and id only) from the database
      const user = await dbClient.getUserById(userId);

      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // Return the user object with a status code 200
      return res.status(200).json({ email: user.email, id: user._id });
    } catch (error) {
      // Handle any errors and return a 500 status code
      console.error(`Error in getMe: ${error}`);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = UsersController;
