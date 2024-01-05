exports.up = function (knex) {
    return knex.schema.createTable('locations', (table) =>{
        table.uuid('uuid').unique().primary();
        table.string('name');
    });
};
  
exports.down = function (knex) {
    return knex.schema.dropTable('locations');
};