/**
 * Integration Test: POST /saveItem Endpoint
 * 
 * This integration test suite covers the testing of the POST /saveItem endpoint for creating new item records.
 * It ensures the correct behavior of the endpoint for various input scenarios.
 * 
 * Test Cases:
 * 1. Create a new item successfully: Should return a 200 status and the correct item record.
 * 2. Attempt to create an item with invalid data (null itemName): Should return a 400 status and not create the item record.
 * 3. Attempt to create an item without the itemName property: Should return a 400 status and not create the item record.
 * 4. Attempt to create an item with an empty itemName property: Should return a 400 status and not create the item record.
 * 5. Attempt to create an item with an invalid itemName property (non-string value): Should return a 400 status and not create the item record.
 * 
 * Test Environment Setup:
 * - Uses the specified API endpoint and the underlying database.
 * - Utilizes the 'supertest' library for making HTTP requests.
 * 
 * Example Usage:
 * - Execute the entire test suite by running the corresponding test runner (e.g., Jest).
 * - The test results will indicate the success or failure of each operation.
 */
const request = require('supertest');
const app = require('../../app.js');
const knexfile = require('../../db/knexfile.js'); 
const db = require("knex")(knexfile.development);
const {v4: uuidv4} = require('uuid');

// Test Data
const location = {
	name: "testing_location_post",
	uuid: uuidv4()
}

const exampleItem = {
	location_uuid: location.uuid,
	itemName: 'TEST_post',
}

// Test Suite
describe('POST /saveItem', () => {
	// Setup: Create a testing location before running the tests
	beforeAll(async () => {
		await db("locations").insert(location).returning("uuid");   
	});

	// Cleanup: Delete the testing location after all tests are complete
	afterAll(async () => {
		await db("locations").delete().where({uuid: exampleItem.location_uuid});
		await db.destroy();
	});

	// Test Case: Create a new item successfully
	test('should return 200, correct item record', async () => {
		const response = await request(app)
		.post(`/saveItem`)
		.send(exampleItem);

		const itemResponse = response.body[0];
		expect(response.status).toBe(200);

		// Assertion: Database record should be created and match the sent data
		const dbRecord = await db('items').select('*').first().where('id', itemResponse.id);
		expect(dbRecord).toHaveProperty('id',itemResponse.id);
		expect(dbRecord).toHaveProperty('itemName',exampleItem.itemName);
		expect(dbRecord).toHaveProperty('location_uuid',exampleItem.location_uuid);
	});

	// Test Case: Attempt to create an item with invalid data (null itemName)
	test('should return 400, wrong item record', async () => {
		const response = await request(app)
		.post(`/saveItem`)
		.send({...exampleItem, itemName: null});

		expect(response.status).toBe(400);
		
		// Assertion: Database record should not be created
		const dbRecord = await db('items').select('*').where('itemName', null);
		expect(dbRecord.length).toBe(0);
	});

	// Test Case: Attempt to create an item without the itemName property
	test('should return 400 when itemName property is missing', async () => {
		const response = await request(app)
		.post('/saveItem')
		.send({}); // Empty body

		expect(response.status).toBe(400);
	});

	// Test Case: Attempt to create an item with an empty itemName property
	test('should return 400 when itemName property is an empty string', async () => {
		const response = await request(app)
		.post('/saveItem')
		.send({ itemName: ""});

		expect(response.status).toBe(400);
	});

	// Test Case: Attempt to create an item with an invalid itemName
	test('should return 400 for invalid itemName property', async () => {
		const invaliditemName = 123; // Use a non-string value
		const response = await request(app)
		.post('/saveItem')
		.send({ itemName: invaliditemName });

		expect(response.status).toBe(400);
  	});
});
