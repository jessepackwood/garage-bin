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
      response.body.should.be.a('object');
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

  describe('GET api/v1/garage_items', () => {
    it('should return all the garage items', () => {
      return chai.request(server)
      .get('/api/v1/garage_items')
      .then(response => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body[0].should.be.a('object');
        response.body[0].id.should.equal(1);
        response.body[0].name.should.equal('motorcycle');
        response.body[1].id.should.equal(2);
        response.body[1].name.should.equal('dirtbike');
        response.body[2].id.should.equal(3);
        response.body.length.should.equal(3);
      })
      .catch(err => {
        throw err;
      });
    });
  });


  describe('POST api/v1/garage_items', () => {
    it('should post one item', () => {
      return chai.request(server)
        .post('/api/v1/garage_items')
        .send({
          name: 'fishing pole',
          reason: 'not fishing',
          cleanliness: 'sparkling'
        })
        .then(response => {
          response.should.have.status(201);
          response.body.should.be.a('object');
          response.body.should.have.property('id');
          response.body.id.should.equal(4);
        })
        .catch(err => {
          throw err;
        });
      });

    it('should return a 422 when a required param is missing', () => {
      return chai.request(server)
      .post('/api/v1/garage_items')
      .send({
        name: 'harley'
      })
      .then(response => {
        response.should.have.status(422);
        response.body.should.have.property('error');
        response.body.error.should.equal('You are missing property reason');
      })
      .catch(error => {
        throw error;
      })
    })
  });

  describe('PATCH api/v1/garage_items/:id', (request, response) => {
    it('should edit one item cleanliness', () => {
      return chai.request(server)
        .patch('/api/v1/garage_items/2')
        .send({
          cleanliness: 'dusty'
        })
        .then(response => {
          response.should.have.status(200);
          response.body.should.equal(1);
        })
        .catch(error => {
          throw error;
        })
    });

    it('should return a 404 if the item is not found', () => {
      return chai.request(server)
        .patch('/api/v1/garage_items/300')
        .send({
          cleanliness: 'dusty'
        })
        .then(response => {
          response.should.have.status(404);
          response.body.should.be.a('object');
          response.body.should.have.property('error');
          response.body.error.should.equal('Not found');
        })
        .catch(error => {
          throw error
        })
    });
  });

});