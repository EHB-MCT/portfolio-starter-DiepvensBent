const request = require('supertest');
const app = require('../../app.js');
const knexfile = require('../../db/knexfile.js'); 
const db = require("knex")(knexfile.development);
const {v4: uuidv4} = require('uuid');

const location = {
  name: "testing_location_id",
  uuid: uuidv4()
}
const item = {
  location_uuid: location.uuid,
  text: "TEST_id"
};

let newItem;

describe('GET /:id', () => {
  beforeAll(async () => {   
    await db("locations").insert(location).returning("uuid");
    const dbItem = await db("items").insert(item).returning("*")
    newItem = dbItem[0]
  });

  afterAll(async () => {
    await db("locations").delete().where({uuid: newItem.location_uuid})
    await db("items").delete().where({id: newItem.id})
    await db.destroy();
  });

  test('should return the correct item record', async () => {
    const itemId = newItem.id;
    const response = await request(app).get(`/${itemId}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', itemId);

    const dbRecord = await db('items').select('*').where('id', itemId);
    expect(dbRecord.length).toBeGreaterThan(0);
    expect(dbRecord[0]).toHaveProperty('id',itemId);
  });

  test('should return 404 for non-existent item', async () => {
    const nonExistentitemId = 999999;
    const response = await request(app).get(`/${nonExistentitemId}`);
    expect(response.status).toBe(404);

    const dbRecord = await db('items').select('*').where('id', nonExistentitemId);
    expect(dbRecord.length).toBe(0);
  });

  test('should return 400 for negative item Id', async () => {
    const nonExistentitemId = -1;
    const response = await request(app).get(`/${nonExistentitemId}`);

    expect(response.status).toBe(400);
  });

  test('should return 400 for string item Id', async () => {
    const nonExistentitemId = "test string name";
    const response = await request(app).get(`/${nonExistentitemId}`);

    expect(response.status).toBe(400);
  });

  test('should return 400 for too large item Id', async () => {
    const nonExistentitemId = "9999999999";
    const response = await request(app).get(`/${nonExistentitemId}`);

    expect(response.status).toBe(400);
  });
});
