process.env.NODE_ENV = 'test';

const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');
const knex = require('../db/knex')

chai.use(chaiHttp);

describe('Client Routes', () => {
  it('should return the homepage', () => {
    return chai.request(server)
    .get('/')
    .then(response => {
      response.should.have.status(200);
      response.should.be.html;
    })
    .catch(err => {
      throw err;
    });
  });

  it('should return a 404 for a route that does not exist', () => {
    return chai.request(server)
    .get('/sad')
    .then(response => {
      response.should.have.status(404);
    })
    .catch(err => {
      throw err;
    });
  });
});

describe('API Routes', () => {
  beforeEach((done) => {
    knex.seed.run()
    .then(() => {
      done();
    });
  });

  describe('GET api/v1/garage', () => {
    it('should return the garage', () => {
      return chai.request(server)
        .get('/api/v1/garage')
        .then(response => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('object');
          response.res.should.be.a('object');
        })
        .catch(err => {
          throw err;
        });
      });
    });

  describe('GET api/v1/garage_items', () => {
    it('should return all garage items', () => {
      return chai.request(server)
        .get('/api/v1/garage_items')
        .then(response => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('object');
          response.res.should.be.a('object');
        })
        .catch(err => {
          throw err;
        });
      });
    });

  describe('GET api/v1/garage_items/:id', () => {
    it('should return one item', () => {
      return chai.request(server)
        .get('/api/v1/garage_items/1')
        .then(response => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('object');
          response.res.should.be.a('object');
        })
        .catch(err => {
          throw err;
        });
      });
    });
}