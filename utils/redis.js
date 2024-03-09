// redis.js

const redis = require('redis');

class RedisClient {
  constructor() {
    // Create a client to connect to Redis
    this.client = redis.createClient();

    // Handle errors
    this.client.on('error', (error) => {
      console.error('Redis connection error:', error);
    });
  }

  async isAlive() {
    try {
      // Check if the connection to Redis is successful
      await this.client.ping();
      return true;
    } catch (error) {
      return false;
    }
  }

  async get(key) {
    return new Promise((resolve, reject) => {
      // Retrieve the value stored in Redis for the given key
      this.client.get(key, (error, value) => {
        if (error) {
          reject(error);
        } else {
          resolve(value);
        }
      });
    });
  }

  async set(key, value, durationInSeconds) {
    return new Promise((resolve, reject) => {
      // Store the value in Redis with an expiration set by the duration argument
      this.client.setex(key, durationInSeconds, value, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  async del(key) {
    return new Promise((resolve, reject) => {
      // Remove the value in Redis for the given key
      this.client.del(key, (error, count) => {
        if (error) {
          reject(error);
        } else {
          resolve(count);
        }
      });
    });
  }
}

// Create and export an instance of RedisClient
const redisClient = new RedisClient();
module.exports = redisClient;
