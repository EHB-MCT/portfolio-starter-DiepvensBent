// knexfile.js
module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: 'localhost',  // Replace with your mysql2 host
      port: 3306,         // Replace with your mysql2 port
      user: 'root',  // Replace with your mysql2 username
      password: '',  // Replace with your mysql2 password
      database: 'test',  // Replace with your mysql2 database name
    },migrations: {
      tableName: 'knex_migrations'
    }
  },
};
