const { expect } = require('chai');
const sinon = require('sinon');
const redisClient = require('../../utils/redis');

describe('RedisClient', () => {
  describe('#isAlive()', () => {
    it('should return true if the client is connected', () => {
      redisClient.connected = true;
      expect(redisClient.isAlive()).to.be.true;
    });

    it('should return false if the client is not connected', () => {
      redisClient.connected = false;
      expect(redisClient.isAlive()).to.be.false;
    });
  });

  describe('#get()', () => {
    it('should return the value for the given key', async () => {
      const getSpy = sinon.spy();
      redisClient.client.get = getSpy;
      const value = 'bar';
      redisClient.client.getAsync = sinon.fake.resolves(value);
      await redisClient.get('foo');
      expect(getSpy.calledWith('foo')).to.be.true;
      expect(redisClient.client.getAsync.calledOnce).to.be.true;
      expect(await redisClient.get('foo')).to.equal(value);
    });
  });

  describe('#set()', () => {
    it('should set the value for the given key with the specified duration', async () => {
      const setSpy = sinon.spy();
      redisClient.client.set = setSpy;
      await redisClient.set('foo', 'bar', 10);
      expect(setSpy.calledWith('foo', 'bar', 'EX', 10)).to.be.true;
    });
  });

  describe('#del()', () => {
    it('should delete the key-value pair for the given key', async () => {
      const delSpy = sinon.spy();
      redisClient.client.del = delSpy;
      await redisClient.set('foo', 'bar', 0);
      await redisClient.del('foo');
      expect(delSpy.calledWith('foo')).to.be.true;
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  after(() => {
    redisClient.client.quit();
  });
});