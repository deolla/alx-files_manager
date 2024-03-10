// this is the AuthController file.

import sha1 from 'sha1';
import { v4 as uuidv4 } from 'uuid';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class AuthController {
  static async getConnect(request, response) {
    const authData = request.header('Authorization');
    let emails = authData.split(' ')[1];
    const buff = Buffer.from(emails, 'base64');
    emails = buff.toString('ascii');
    const info = emails.split(':');
    if (info.length !== 2) {
      response.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const hashedPassword = sha1(info[1]);
    const users = dbClient.db.collection('users');
    users.findOne({ email: info[0], password: hashedPassword }, async (err, user) => {
      if (user) {
        const token = uuidv4();
        const key = `auth_${token}`;
        await redisClient.set(key, user._id.toString(), 60 * 60 * 24);
        response.status(200).json({ token });
      } else {
        response.status(401).json({ error: 'Unauthorized' });
      }
    });
  }

  static async getDisconnect(request, response) {
    const token = request.header('X-Token');
    const key = `auth_${token}`;
    const _id = await redisClient.get(key);
    if (_id) {
      await redisClient.del(key);
      response.status(204).json({});
    } else {
      response.status(401).json({ error: 'Unauthorized' });
    }
  }
}

module.exports = AuthController;
