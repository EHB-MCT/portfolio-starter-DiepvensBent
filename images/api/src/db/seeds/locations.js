/**
 * Knex Seeding: locations Table
 * 
 * This seeding file is responsible for populating the 'locations' table with initial data.
 * It checks if there are existing records in the 'locations' table and inserts new records
 * if there are none. The seeding uses UUIDs for unique identifiers.
 * 
 * Seeding Steps:
 * - Check if there are existing records in the 'locations' table.
 * - If no records exist, insert two new records with UUIDs and names.
 */
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
