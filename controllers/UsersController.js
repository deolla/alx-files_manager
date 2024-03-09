const sha1 = require('sha1');
const dbClient = require('../utils/db');

exports.postNew = async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Missing email' });
  }

  if (!password) {
    return res.status(400).json({ error: 'Missing password' });
  }

  const user = await dbClient.findOne('users', { email });

  if (user) {
    return res.status(400).json({ error: 'Already exist' });
  }

  const hashedPassword = sha1(password);

  const newUser = {
    email,
    password: hashedPassword,
  };

  const result = await dbClient.insertOne('users', newUser);

  res.status(201).json({ id: result.insertedId, email });
};