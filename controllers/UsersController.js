// controllers/UsersController.js

const { response } = require('express');
const sha1 = require('sha1');
const dbClient = require('../utils/db');

class UsersController {
  static async postNew(req, res) {
    try {
      // Extract email and password from the request body
      const { email, password } = req.body;

      // Check if email and password are provided
      if (!email) {
        return res.status(400).json({ error: 'Missing email' });
      }

      if (!password) {
        return res.status(400).json({ error: 'Missing password' });
      }

      // Check if the email already exists in the database
      const existingUser = await dbClient.client.db().collection('users').findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'Already exist' });
      }

      // Hash the password using SHA1
      const hashedPassword = sha1(password);

      // Create a new user object
      const newUser = {
        email,
        password: hashedPassword,
      };

      // Insert the new user into the 'users' collection
      const result = await dbClient.client.db().collection('users').insertOne(newUser);

      // Extract the id from the result and construct the response
      const { _id } = result.ops[0];
      const responseUser = { id: _id, email };

      // Return the new user with a status code 201
      res.status(201).json(responseUser);
    } catch (error) {
      // Handle any errors and return a 500 status code
      console.error(`Error in postNew: ${error}`);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

module.exports = UsersController;
