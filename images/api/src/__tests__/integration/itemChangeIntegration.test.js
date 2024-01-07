/**
 * Integration Test: PUT /changeItem/:id Endpoint
 * 
 * This integration test suite covers the testing of the PUT /changeItem/:id endpoint for updating item records.
 * It ensures the correct behavior of the endpoint for various input scenarios.
 * 
 * Test Cases:
 * 1. Update the item record: Should return a 200 status.
 * 2. Non-existent item: Should return a 404 status.
 * 3. Invalid input: Should return a 400 status.
 * 4. Updating without sending itemName: Should return a 400 status.
 * 5. Updating with empty itemName: Should return a 400 status.
 * 6. Update an item with additional fields: Should update the item and ignore additional fields.
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
	name: 'testing_location_put',
	uuid: uuidv4()
}

const exampleItem = {
	location_uuid: location.uuid,
	itemName: 'TEST_put',
}

let updatedItem;

describe('PUT /changeItem/:id', ()=> {

	// Setup: Create a testing location and item before running the tests
	beforeAll(async()=> {
		await db("locations").insert(location).returning("uuid");   
		const newItem = await db("items").insert(exampleItem).returning("*");
		updatedItem = { ...newItem[0], itemName: "Updated_TEST_id" };
	});

	// Cleanup: Delete the testing location and item after all tests are complete
	afterAll(async () => {
		await db("locations").delete().where({uuid: updatedItem.location_uuid});
		await db("items").delete().where({id: updatedItem.id});
		await db.destroy();
	});

	// Test Case: Update the item record and return the correct ID
	test('should update the item record and return the correct id', async () => {
		const itemId = updatedItem.id;
		const response = await request(app)
		.put(`/changeItem/${itemId}`)
		.send({itemName: updatedItem.itemName});

		expect(response.status).toBe(200);
		// Assertion: Response body should contain the correct ID
		expect(response.body).toHaveProperty('id', itemId);

		// Assertion: Database record should be updated
		const dbRecord = await db('items').select('*').where('id', itemId);
		expect(dbRecord.length).toBeGreaterThan(0);
		expect(dbRecord[0]).toHaveProperty('itemName', updatedItem.itemName);
	});
	// Test Case: Non-existent item
	test('should return 404 for non-existent item', async () => {
		const nonExistentItemId = 999999;
		const response = await request(app)
		.put(`/changeItem/${nonExistentItemId}`)
		.send({ itemName: "Updated_TEST_id" });

		// Assertion: Response status should be 404
		expect(response.status).toBe(404);

		// Assertion: Database record should not exist
		const dbRecord = await db('items').select('*').where('id', nonExistentItemId);
		expect(dbRecord.length).toBe(0);
	});

	// Test Case: Invalid input
	test('should return 400 for invalid input', async () => {
		const invalidItemId = "test string name";
		const response = await request(app)
		.put(`/changeItem/${invalidItemId}`)
		.send({ itemName: "Updated_TEST_id" });
		
		expect(response.status).toBe(400);
	});

	// Test Case: Updating without sending itemName
	test('should return 400 when updating without sending itemName', async () => {
		const itemId = updatedItem.id;
		const response = await request(app)
		.put(`/changeItem/${itemId}`)
		.send({}); // Empty body

		expect(response.status).toBe(400);
	});

	// Test Case: Updating with empty itemName
	test('should return 400 when updating with empty itemName', async () => {
		const itemId = updatedItem.id;
		const response = await request(app)
		.put(`/changeItem/${itemId}`)
		.send({ itemName: "" });

		expect(response.status).toBe(400);

		// Assertion: Database should remain unchanged
		const dbRecord = await db('items').select('*').where('id', itemId);
		expect(dbRecord.length).toBeGreaterThan(0);
		expect(dbRecord[0]).toHaveProperty('itemName', updatedItem.itemName);
	});

	// Test Case: Update an item ignoring additional fields
	test('should update an item ignoring additional fields', async () => {
		const itemId = updatedItem.id;
		const response = await request(app)
		.put(`/changeItem/${itemId}`)
		.send({ itemName: "Updated_itemName", additionalField: "extra" });

		expect(response.status).toBe(200);

		 // Assertion: Database record should be updated and ignore additional fields
		const dbRecord = await db('items').select('*').where('id', itemId);
		expect(dbRecord.length).toBeGreaterThan(0);
		expect(dbRecord[0]).toHaveProperty('itemName', "Updated_itemName");
		expect(dbRecord[0]).not.toHaveProperty('additionalField');
	});
});