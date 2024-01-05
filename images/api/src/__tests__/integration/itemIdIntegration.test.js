/**
 * Integration Test: GET /:id Endpoint
 * 
 * This integration test suite covers the testing of the GET /:id endpoint for retrieving item records.
 * It ensures the correct behavior of the endpoint for various input scenarios.
 * 
 * Test Cases:
 * 1. Retrieve the correct item record: Should return a 200 status and the expected item record.
 * 2. Non-existent item: Should return a 404 status.
 * 3. Negative item ID: Should return a 400 status.
 * 4. String item ID: Should return a 400 status.
 * 5. Too large item ID: Should return a 400 status.
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
	name: "testing_location_id",
	uuid: uuidv4()
}
const item = {
	location_uuid: location.uuid,
	itemName: "TEST_id"
};

let newItem;

// Test Suite
describe('GET /:id', () => {
	// Setup: Create a testing location and item before running the tests
	beforeAll(async () => {   
		await db("locations").insert(location).returning("uuid");
		const dbItem = await db("items").insert(item).returning("*")
		newItem = dbItem[0]
	});

	// Cleanup: Delete the testing location and item after all tests are complete
	afterAll(async () => {
		await db("locations").delete().where({uuid: newItem.location_uuid})
		await db("items").delete().where({id: newItem.id})
		await db.destroy();
	});

	// Test Case: Retrieve the correct item record
	test('should return the correct item record', async () => {
		const itemId = newItem.id;
		const response = await request(app).get(`/${itemId}`);

		expect(response.status).toBe(200);
		// Assertion: Response body should contain the correct item ID
		expect(response.body).toHaveProperty('id', itemId);

		// Assertion: Database record should match the expected item
		const dbRecord = await db('items').select('*').where('id', itemId);
		expect(dbRecord.length).toBeGreaterThan(0);
		expect(dbRecord[0]).toHaveProperty('id',itemId);
	});

	// Test Case: Non-existent item
	test('should return 404 for non-existent item', async () => {
		const nonExistentitemId = 999999;
		const response = await request(app).get(`/${nonExistentitemId}`);
		expect(response.status).toBe(404);

		// Assertion: Database record should not exist
		const dbRecord = await db('items').select('*').where('id', nonExistentitemId);
		expect(dbRecord.length).toBe(0);
	});

	// Test Case: Negative item ID
	test('should return 400 for negative item Id', async () => {
		const negativeItemId = -1;
        const response = await request(app).get(`/${negativeItemId}`);

		expect(response.status).toBe(400);
	});

	// Test Case: String item ID
	test('should return 400 for string item Id', async () => {
		const stringItemId = "test_string_name";
        const response = await request(app).get(`/${stringItemId}`);

		expect(response.status).toBe(400);
	});

	// Test Case: Too large item ID
	test('should return 400 for too large item Id', async () => {
		const largeItemId = 2147483650;
        const response = await request(app).get(`/${largeItemId}`);

		expect(response.status).toBe(400);
	});
});
