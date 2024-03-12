// this file contains tests for the users controller.

import dbClient from '../../utils/db';

describe('+ UserCtrl', () => {
  const testUser = {
    email: 'sample@email.com',
    password: 'secure123',
  };

  before(function (done) {
    this.timeout(10000);
    dbClient.users()
      .then((userCollection) => {
        userCollection.deleteMany({ email: testUser.email })
          .then(() => done())
          .catch((deleteErr) => done(deleteErr));
      }).catch((connectErr) => done(connectErr));
    setTimeout(done, 5000);
  });

  describe('+ POST: /users', () => {
    it('+ Fails without email and with password', function (done) {
      this.timeout(5000);
      request.post('/users')
        .send({
          password: testUser.password,
        })
        .expect(400)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.deep.eql({ error: 'Missing email' });
          done();
        });
    });

    it('+ Fails with email and without password', function (done) {
      this.timeout(5000);
      request.post('/users')
        .send({
          email: testUser.email,
        })
        .expect(400)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.deep.eql({ error: 'Missing password' });
          done();
        });
    });

    it('+ Succeeds with email and password', function (done) {
      this.timeout(5000);
      request.post('/users')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(201)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body.email).to.eql(testUser.email);
          expect(res.body.id.length).to.be.greaterThan(0);
          done();
        });
    });

    it('+ Fails when the user already exists', function (done) {
      this.timeout(5000);
      request.post('/users')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(400)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.deep.eql({ error: 'Already exist' });
          done();
        });
    });
  });

});
