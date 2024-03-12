const { MongoClient } = require('mongodb');
const assert = require('assert');
const dbClient = require('../../utils/db'); // assuming the file is named dbClient.js

describe('DBClient', () => {
  before(async () => {
    await dbClient.client.connect();
  });

  after(async () => {
    // Disconnect from the database after running the tests
    await dbClient.client.close();
  });

  describe('#isAlive()', () => {
    it('should return true if the client is connected', () => {
      assert.strictEqual(dbClient.isAlive(), true);
    });
  });

  describe('#nbUsers()', () => {
    it('should return the number of users in the database', async () => {
      const usersNum = await dbClient.nbUsers();
      assert.strictEqual(typeof usersNum, 'number');
    });
  });

  describe('#nbFiles()', () => {
    it('should return the number of files in the database', async () => {
      const filesNum = await dbClient.nbFiles();
      assert.strictEqual(typeof filesNum, 'number');
    });
  });
});