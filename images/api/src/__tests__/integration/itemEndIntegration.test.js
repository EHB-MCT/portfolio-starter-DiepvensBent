const request = require('supertest');
const app = require('../../app.js');
const knexfile = require('../../db/knexfile.js'); 
const db = require("knex")(knexfile.development);
const {v4: uuidv4} = require('uuid');

const location = {
    name: 'testing_location_end',
    uuid: uuidv4()
};

const newItem = {
    location_uuid: location.uuid,
    itemName: 'TEST_end',
};

let itemResponseId;

describe('End-to-End CRUD Operations', () => {
    beforeAll(async () => {
        await db("locations").insert(location).returning("uuid");
    });

    afterAll(async () => {
        await db("locations").delete().where({ uuid: newItem.location_uuid });
        await db.destroy();
    });

    test('should create a new item', async () => {
        const response = await request(app)
        .post(`/saveItem`)
        .send(newItem);

        expect(response.status).toBe(200);
        itemResponseId = response.body[0].id;

        const dbRecord = await db('items').select('*').first().where('id', itemResponseId);
        expect(dbRecord).toHaveProperty('id',itemResponseId);
        expect(dbRecord).toHaveProperty('itemName',newItem.itemName);
        expect(dbRecord).toHaveProperty('location_uuid',newItem.location_uuid);
    });

    test('should get the created item by ID', async () => {
        const response = await request(app)
        .get(`/${itemResponseId}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('id', itemResponseId);

        const dbRecord = await db('items').select('*').where('id', itemResponseId);
        expect(dbRecord.length).toBeGreaterThan(0);
        expect(dbRecord[0]).toHaveProperty('id', itemResponseId);
    });

    test('should update the created item', async () => {
        const updateditemName = 'UPDATED_itemName';
        const response = await request(app)
        .put(`/changeItem/${itemResponseId}`)
        .send({ itemName: updateditemName });

        expect(response.status).toBe(200);

        const dbRecord = await db('items').select('*').where('id', itemResponseId);
        expect(dbRecord.length).toBeGreaterThan(0);
        expect(dbRecord[0]).toHaveProperty('itemName', updateditemName);
    })

    test('should delete the created item', async () => {
        const response = await request(app)
        .delete(`/deleteItem/${itemResponseId}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'Item deleted successfully.');

        const dbRecord = await db('items').select('*').where('id', itemResponseId);
        expect(dbRecord.length).toBe(0);
    });
});
