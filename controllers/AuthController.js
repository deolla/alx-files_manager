const sha1 = require('sha1');
const { v4: uuidv4 } = require('uuid');
const redisClient = require('../utils/redis');

exports.getConnect = async (req, res) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const decoded = Buffer.from(authorization.split(' ')[1], 'base64').toString().split(':');
  const [email, password] = decoded;

  const user = await findUser(email, password);

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = uuidv4();
  redisClient.set(`auth_${token}`, user.id, 'EX', 24 * 60 * 60);

  res.status(200).json({ token });
  return;
};

exports.getDisconnect = async (req, res) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const [, token] = authorization.split(' ');

  redisClient.del(`auth_${token}`);

  res.status(204).send();
  return;
};

const findUser = (email, password) => dbClient.findOne('users', { email }).then((user) => {
  if (!user) {
    return null;
  }

  if (sha1(password) === user.password) {
    return user;
  }

  return null;
});
