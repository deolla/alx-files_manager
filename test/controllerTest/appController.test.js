// this file is a test suite for the AppController.

import dbClient from '../../utils/db';

describe('+ AppCtrl', () => {
  before(function (done) {
    this.timeout(10000);
    Promise.all([dbClient.users(), dbClient.files()])
      .then(([users, files]) => {
        Promise.all([users.deleteMany({}), files.deleteMany({})])
          .then(() => done())
          .catch((deleteErr) => done(deleteErr));
      }).catch((connectErr) => done(connectErr));
  });

  describe('+ GET: /status', () => {
    it('+ Services online', function (done) {
      request.get('/status')
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.deep.eql({ redis: true, db: true });
          done();
        });
    });
  });

  describe('+ GET: /stats', () => {
    it('+ Correct stats about db collections', function (done) {
      request.get('/stats')
        .expect(200)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.deep.eql({ users: 0, files: 0 });
          done();
        });
    });

    it('+ Correct stats about db collections [alt]', function (done) {
      this.timeout(10000);
      Promise.all([dbClient.users(), dbClient.files()])
        .then(([users, files]) => {
          Promise.all([
            users.insertMany([{ email: 'john@mail.com' }]),
            files.insertMany([
              { name: 'foo.txt', type: 'file'},
              {name: 'pic.png', type: 'image' },
            ])
          ])
            .then(() => {
              request.get('/stats')
                .expect(200)
                .end((err, res) => {
                  if (err) {
                    return done(err);
                  }
                  expect(res.body).to.deep.eql({ users: 1, files: 2 });
                  done();
                });
            })
            .catch((deleteErr) => done(deleteErr));
        }).catch((connectErr) => done(connectErr));
    });
  });
});
