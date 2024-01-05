/**
 * Knex Migration: items Table
 * 
 * This migration file is responsible for defining the schema changes related to the 'items' table.
 * It includes the creation of the 'items' table with specific columns and their data types.
 * Additionally, it defines the rollback operation for dropping the 'items' table.
 * 
 * Table Structure:
 * - id: Primary key, auto-incremented integer.
 * - itemName: String column for storing the name of items.
 * - location_uuid: UUID column for referencing the location to which an item belongs.
 * 
 * Migration Steps:
 * - Up: Creates the 'items' table with the specified columns.
 * - Down: Drops the 'items' table if the need for rollback arises.
 * 
 */
exports.up = function (knex) {
  	return knex.schema.createTable('items', function (table) {
    	table.increments('id').primary(); //id (Primary key, auto-incremented integer)
    	table.string('itemName');
    	table.uuid('location_uuid'); 
 	});
};
  
exports.down = function (knex) {
    return knex.schema.dropTable('items');
};
