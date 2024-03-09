const redisClient = require('../utils/redis');
const dbClient = require('../utils/db');

exports.getStatus = async (req, res) => {
  try {
    await redisClient.isAlive();
    await dbClient.isAlive();
    res.status(200).json({ redis: true, db: true });
  } catch (err) {
    res.status(500).json({ redis: false, db: false });
  }
};

exports.getStats = async (req, res) => {
  try {
    const users = await dbClient.nbUsers();
    const files = await dbClient.nbFiles();
    res.status(200).json({ users, files });
  } catch (err) {
    res.status(500).json({ users: 0, files: 0 });
  }
};