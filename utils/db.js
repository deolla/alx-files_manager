const { MongoClient } = require('mongodb');

class DBClient {
  constructor() {
    this.client = new MongoClient(
      `mongodb://${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '27017'}/${process.env.DB_DATABASE || 'files_manager'}`,
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
  }

  async isAlive() {
    try {
      await this.client.connect();
      return true;
    } catch (err) {
      console.error('MongoDB client error:', err);
      return false;
    }
  }

  async nbUsers() {
    try {
      const collection = this.client.db().collection('users');
      const count = await collection.countDocuments();
      return count;
    } catch (err) {
      console.error('Error counting users:', err);
      return 0;
    }
  }

  async nbFiles() {
    try {
      const collection = this.client.db().collection('files');
      const count = await collection.countDocuments();
      return count;
    } catch (err) {
      console.error('Error counting files:', err);
      return 0;
    }
  }
}

const dbClient = new DBClient();

module.exports = dbClient;