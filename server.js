const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const environment = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[environment];
const database = require('knex')(configuration);

app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname + '/public')));

app.locals.title = 'GarageBin';

app.get('/', (request, response) => {
  response.send('Garage Bin');
});

app.get('/api/v1/garage_items', (request, response) => {
  database('garage_items').select()
    .then((items) => {
      response.status(200).json(items)
    })
    .catch((error) => {
      response.status(422).json({ error })
    });
});

app.post('/api/v1/garage_items', (request, response) => {
  const garageItem = request.body;

  for (const requiredParams of ['name', 'reason', 'cleanliness']) {
    if (!garageItem[requiredParams]) {
      return response.status(422).json({
        error: `You are missing ${requiredParams}`
      });
    }
  }

  database('garage_items').insert(garageItem, 'id')
    .then(garageItem => response.status(201).json({ id: garageItem[0] }))
    .catch(error => response.status(404).json({ error }));
});

app.listen(app.get('port'), () => {
  /* eslint-disable no-console */
  console.log(`${app.locals.title} is running on ${app.get('port')}. env: ${environment}`);
});

module.exports = app;