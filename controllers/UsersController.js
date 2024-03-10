// this is the UsersController file.

const dbClient = require('../utils/db');

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
    const token = req.headers['x-token'];
    if (!token) {
      res.status(401).json({ error: 'Unauthorized' });
      res.end();
      return;
    }
    const id = await redisClient.get(`auth_${token}`);
    if (!id) {
      res.status(401).json({ error: 'Unauthorized' });
      res.end();
      return;
    }
    const user = await dbClient.getUserById(id);
    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      res.end();
      return;
    }
    res.json({ id: user._id, email: user.email }).end();
  }
}

module.exports = UsersController;
