
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('garage_items').del()
    .then( function () {
      return knex.raw('ALTER SEQUENCE garage_items_id_seq RESTART WITH 1')
    })
    .then(function () {
      // Inserts seed entries
      return knex('garage_items').insert([
        {name: 'motorcycle', reason: 'winter', cleanliness: 'sparkling'},
        {name: 'dirtbike', reason: 'winter', cleanliness: 'dusty'},
        {name: 'tent', reason: 'camping gear', cleanliness: 'dusty'}
      ]);
    });
};