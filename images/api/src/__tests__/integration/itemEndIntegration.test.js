/**
* End-to-End Test Suite: CRUD Operations for Items
* 
* This test suite covers the end-to-end testing of CRUD operations for items using the specified API endpoints.
* It ensures the proper creation, retrieval, update, and deletion of items from the database.
* 
* Test Suite Structure:
* 1. Create a new item
* 2. Get the created item by ID
* 3. Update the created item
* 4. Delete the created item
* 
* Test Environment Setup:
* - Uses the specified API endpoints and the underlying database.
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
    name: 'testing_location_end',
    uuid: uuidv4()
};

const newItem = {
    location_uuid: location.uuid,
    itemName: 'TEST_end',
};

let itemResponseId;

// Test Suite
describe('End-to-End CRUD Operations', () => {
    // Setup: Create a testing location before running the tests
    beforeAll(async () => {
        await db("locations").insert(location).returning("uuid");
    });

     // Cleanup: Delete the testing location and close the database connection after all tests are complete
    afterAll(async () => {
        await db("locations").delete().where({ uuid: newItem.location_uuid });
        await db.destroy();
    });

    // Test Case: Create a new item
    test('should create a new item', async () => {
        const response = await request(app)
        .post(`/saveItem`)
        .send(newItem);

        // Assertion: Response status should be 200
        expect(response.status).toBe(200);
        // Save the ID of the created item for subsequent tests
        itemResponseId = response.body[0].id;

        // Assertion: Database record should match the created item
        const dbRecord = await db('items').select('*').first().where('id', itemResponseId);
        expect(dbRecord).toHaveProperty('id',itemResponseId);
        expect(dbRecord).toHaveProperty('itemName',newItem.itemName);
        expect(dbRecord).toHaveProperty('location_uuid',newItem.location_uuid);
    });

    // Test Case: Get the created item by ID
    test('should get the created item by ID', async () => {
        const response = await request(app)
        .get(`/${itemResponseId}`);

        // Assertion: Response status should be 200
        expect(response.status).toBe(200);
        // Assertion: Response body should contain the correct item ID
        expect(response.body).toHaveProperty('id', itemResponseId);

        // Assertion: Database record should match the created item
        const dbRecord = await db('items').select('*').where('id', itemResponseId);
        expect(dbRecord.length).toBeGreaterThan(0);
        expect(dbRecord[0]).toHaveProperty('id', itemResponseId);
    });

    // Test Case: Update the created item
    test('should update the created item', async () => {
        const updateditemName = 'UPDATED_itemName';
        const response = await request(app)
        .put(`/changeItem/${itemResponseId}`)
        .send({ itemName: updateditemName });

        // Assertion: Response status should be 200
        expect(response.status).toBe(200);

        // Assertion: Database record should match the updated item
        const dbRecord = await db('items').select('*').where('id', itemResponseId);
        expect(dbRecord.length).toBeGreaterThan(0);
        expect(dbRecord[0]).toHaveProperty('itemName', updateditemName);
    })

    // Test Case: Delete the created item
    test('should delete the created item', async () => {
        const response = await request(app)
        .delete(`/deleteItem/${itemResponseId}`);

        // Assertion: Response status should be 200
        expect(response.status).toBe(200);
        // Assertion: Response body should indicate successful deletion
        expect(response.body).toHaveProperty('message', 'Item deleted successfully.');

        // Assertion: Database record should be deleted
        const dbRecord = await db('items').select('*').where('id', itemResponseId);
        expect(dbRecord.length).toBe(0);
    });
});
