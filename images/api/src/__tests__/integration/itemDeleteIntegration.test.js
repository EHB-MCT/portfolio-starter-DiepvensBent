const request = require('supertest');
const app = require('../../app.js');
const knexfile = require('../../db/knexfile.js'); 
const db = require("knex")(knexfile.development);
const {v4: uuidv4} = require('uuid');

const location = {
    name: 'testing_location_delete',
    uuid: uuidv4()
};

const exampleItem = {
    location_uuid: location.uuid,
    itemName: 'TEST_delete',
};

let deletedItem;

describe('DELETE /deleteItem/:id', () => {
    beforeAll(async () => {
        await db("locations").insert(location).returning("uuid");   
        const newItem = await db("items").insert(exampleItem).returning("*");
        deletedItem = newItem[0];
    });

    afterAll(async () => {
        await db("locations").delete().where({ uuid: deletedItem.location_uuid });
        await db.destroy();
     });

    test('should delete the item record and return success message', async () => {
        const itemId = deletedItem.id;
        const response = await request(app)
        .delete(`/deleteItem/${itemId}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Item deleted successfully.');

        const dbRecord = await db('items').select('*').where('id', itemId);
        expect(dbRecord.length).toBe(0);
    });

    test('should return 404 for non-existent item', async () => {
        const nonExistentItemId = 999999;
        const response = await request(app)
        .delete(`/deleteItem/${nonExistentItemId}`);
    
        expect(response.status).toBe(404);
    
        const dbRecord = await db('items').select('*').where('id', nonExistentItemId);
        expect(dbRecord.length).toBe(0);
    });

    test('should return 400 for negative input', async () => {
        const negativeItemId = -1;
        const response = await request(app)
        .delete(`/deleteItem/${negativeItemId}`);
    
        expect(response.status).toBe(400);
    });
    
    test('should return 400 for invalid input', async () => {
        const invalidItemId = "test string name";
        const response = await request(app)
        .delete(`/deleteItem/${invalidItemId}`);
    
        expect(response.status).toBe(400);
    });
     
    test('should return 400 for invalid input', async () => {
        const invalidItemId = "test string name";
        const response = await request(app)
        .delete(`/deleteItem/${invalidItemId}`);
    
        expect(response.status).toBe(400);
    });

    test('should return 400 for too large item Id', async () => {
        const invalidItemId = "9999999999";
        const response = await request(app)
        .delete(`/deleteItem/${invalidItemId}`);

        expect(response.status).toBe(400);
    });
});