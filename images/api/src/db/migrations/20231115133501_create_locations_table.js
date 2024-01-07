/**
 * Knex Migration: locations Table
 * 
 * This migration file is responsible for defining the schema changes related to the 'locations' table.
 * It includes the creation of the 'locations' table with specific columns and their data types.
 * Additionally, it defines the rollback operation for dropping the 'locations' table.
 * 
 * Table Structure:
 * - uuid: Primary key and unique identifier using UUID format.
 * - name: String column for storing the name of locations.
 * 
 * Migration Steps:
 * - Up: Creates the 'locations' table with the specified columns.
 * - Down: Drops the 'locations' table if the need for rollback arises.
 * 
 */
exports.up = function (knex) {
    return knex.schema.createTable('locations', (table) =>{
        table.uuid('uuid').unique().primary(); // uuid (Primary key and unique identifier using UUID format)
        table.string('name');
    });
};
  
exports.down = function (knex) {
    return knex.schema.dropTable('locations');
};