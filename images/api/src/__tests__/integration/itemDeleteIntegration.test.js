/**
 * Integration Test: DELETE /deleteItem/:id Endpoint
 * 
 * This integration test suite covers the testing of the DELETE /deleteItem/:id endpoint for deleting item records.
 * It ensures the correct behavior of the endpoint for various input scenarios.
 * 
 * Test Cases:
 * 1. Delete the item record and return success message: Should return a 200 status and success message.
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
    name: 'testing_location_delete',
    uuid: uuidv4()
};

const exampleItem = {
    location_uuid: location.uuid,
    itemName: 'TEST_delete',
};

let deletedItem;

// Test Suite
describe('DELETE /deleteItem/:id', () => {

    // Setup: Create a testing location and item before running the tests
    beforeAll(async () => {
        await db("locations").insert(location).returning("uuid");   
        const newItem = await db("items").insert(exampleItem).returning("*");
        deletedItem = newItem[0];
    });

    // Cleanup: Delete the testing location and item after all tests are complete
    afterAll(async () => {
        await db("locations").delete().where({ uuid: deletedItem.location_uuid });
        await db.destroy();
     });
    
    // Test Case: Delete the item record and return success message
    test('should delete the item record and return success message', async () => {
        const itemId = deletedItem.id;
        const response = await request(app)
        .delete(`/deleteItem/${itemId}`);

        expect(response.status).toBe(200);
        // Assertion: Response body should contain success message
        expect(response.body).toHaveProperty('message', 'Item deleted successfully.');

        // Assertion: Database record should not exist
        const dbRecord = await db('items').select('*').where('id', itemId);
        expect(dbRecord.length).toBe(0);
    });

    // Test Case: Non-existent item
    test('should return 404 for non-existent item', async () => {
        const nonExistentItemId = 999999;
        const response = await request(app)
        .delete(`/deleteItem/${nonExistentItemId}`);
    
        // Assertion: Response status should be 404
        expect(response.status).toBe(404);
    
        // Assertion: Database record should not exist
        const dbRecord = await db('items').select('*').where('id', nonExistentItemId);
        expect(dbRecord.length).toBe(0);
    });

    // Test Case: Negative item ID
    test('should return 400 for negative input', async () => {
        const negativeItemId = -1;
        const response = await request(app)
        .delete(`/deleteItem/${negativeItemId}`);
    
        expect(response.status).toBe(400);
    });
     
    // Test Case: String item ID
    test('should return 400 for invalid input', async () => {
        const stringItemId  = "test string name";
        const response = await request(app)
        .delete(`/deleteItem/${stringItemId }`);
    
        expect(response.status).toBe(400);
    });

    // Test Case: Too large item ID
    test('should return 400 for too large item Id', async () => {
        const largeItemId = "2147483650";
        const response = await request(app)
        .delete(`/deleteItem/${largeItemId}`);

        expect(response.status).toBe(400);
    });
});