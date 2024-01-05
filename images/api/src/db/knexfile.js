// knexfile.js
module.exports = {
	development: {
		client: 'pg',
		connection: process.env.PG_CONNECTION_STRING ||  "postgres://user:password@localhost:5432/testDB",
		migrations: {
			tableName: 'knex_migrations',
			directory: './migrations'
		},
		seeds: {
			directory: './seeds'
		}
	}
};
