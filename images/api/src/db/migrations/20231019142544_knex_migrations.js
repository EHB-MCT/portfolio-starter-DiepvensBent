exports.up = function (knex) {
    return knex.schema.createTable('items', function (table) {
      table.increments('id').primary();
      table.string('text');
      
    });
  };

exports.down = function (knex) {
    return knex.schema.dropTable('items');
  };