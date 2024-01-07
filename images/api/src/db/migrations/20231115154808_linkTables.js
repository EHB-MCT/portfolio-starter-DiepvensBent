/**
 * Knex Migration: Modify items Table (Add Foreign Key)
 * 
 * This migration file is responsible for modifying the 'items' table by adding a foreign key constraint
 * to the 'location_uuid' column, referencing the 'uuid' column in the 'locations' table.
 * It ensures referential integrity between 'items' and 'locations'.
 * 
 * Migration Steps:
 * - Up: Adds a foreign key constraint to the 'location_uuid' column in the 'items' table.
 *   - The foreign key references the 'uuid' column in the 'locations' table.
 *   - It specifies CASCADE onUpdate, updating the reference if the location UUID is updated.
 *   - It specifies CASCADE onDelete, deleting items if the referenced location is deleted.
 * 
 * - Down: Drops the 'location_uuid' column from the 'items' table.
 * 
 */
exports.up = function (knex) {
    return knex.schema.table('items', (table) => {
      	table
      	.uuid('location_uuid')
      	.references('uuid')
      	.inTable('locations')
      	.onUpdate('CASCADE') // Update the reference if the location UUID is updated
      	.onDelete('CASCADE').alter(); // Delete items if the referenced location is deleted
    });
};
  
exports.down = function (knex) {
    return knex.schema.table('items', (table) => {
      	table.dropColumn('location_uuid');
    });
};
