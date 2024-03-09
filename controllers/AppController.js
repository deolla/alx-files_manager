const { redisClient } = require('../utils/redis');
const dbClient = require('../utils/db');

exports.getStatus = async (req, res) => {
  try {
    const redisAlive = await redisClient.ping();
    const dbAlive = await dbClient.authenticate();

    res.status(200).json({ redis: redisAlive, db: dbAlive });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getStats = async (req, res) => {
  try {
    const usersCount = await dbClient.nbUsers();
    const filesCount = await dbClient.nbFiles();

    res.status(200).json({ users: usersCount, files: filesCount });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
