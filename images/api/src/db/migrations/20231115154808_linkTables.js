exports.up = function (knex) {
    return knex.schema.table('locations', (table) => {
      table
        .uuid('location_uuid')
        .references('uuid')
        .inTable('locations')
        .onUpdate('CASCADE') // Optional: Update the reference if the location UUID is updated
        .onDelete('CASCADE').alter(); // Optional: Delete items if the referenced location is deleted
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.table('artworks', (table) => {
      table.dropColumn('location_uuid');
    });
  };
