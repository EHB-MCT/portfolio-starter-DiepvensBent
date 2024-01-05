/**
 * Knex Configuration
 * 
 * This configuration file defines the database settings and migration/seeding directories for Knex.
 * It is used to establish a connection with the database during development.
 * 
 * Configuration Details:
 * - development: Specifies the environment configuration for development.
 *   - client: Specifies the database client (PostgreSQL, in this case).
 *   - connection: Specifies the database connection, the 'PG_CONNECTION_STRING' environment variable can be overridden for local testing.
 *   - migrations: Specifies the configuration for database migrations.
 *     - tableName: Specifies the name of the migrations table.
 *     - directory: Specifies the directory where migration files are located.
 *   - seeds: Specifies the configuration for database seeds.
 *     - directory: Specifies the directory where seed files are located.
 * 
 */
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
