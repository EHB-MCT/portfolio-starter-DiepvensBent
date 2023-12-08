const { v4: uuidv4 } = require('uuid');

exports.seed = async function (knex) {
  // Check if there are existing records in the 'locations' table
  const existingLocations = await knex('locations').count('* as count').first();

  // If there are no existing records, insert new records
  if (parseInt(existingLocations.count) === 0) {
    // Insert two records with a UUID and a name
    const newLocations = [
      { uuid: uuidv4(), name: 'Location 1' },
      { uuid: uuidv4(), name: 'Location 2' },
    ];

    await knex('locations').insert(newLocations);
  }
};
