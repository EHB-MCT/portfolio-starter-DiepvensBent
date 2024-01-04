const request = require('supertest');
const app = require('../../app.js');
const knexfile = require('../../db/knexfile.js'); 
const db = require("knex")(knexfile.development);
const {v4: uuidv4} = require('uuid');

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
  beforeAll(async()=> {
    await db("locations").insert(location).returning("uuid");   
    const newItem = await db("items").insert(exampleItem).returning("*");
    updatedItem = { ...newItem[0], itemName: "Updated_TEST_id" };
  });

  afterAll(async () => {
    await db("locations").delete().where({uuid: updatedItem.location_uuid});
    await db("items").delete().where({id: updatedItem.id});
    await db.destroy();
  });

  test('should update the item record and return the correct id', async () => {
    const itemId = updatedItem.id;
    const response = await request(app)
    .put(`/changeItem/${itemId}`)
    .send({itemName: updatedItem.itemName});

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', itemId);

    const dbRecord = await db('items').select('*').where('id', itemId);
    expect(dbRecord.length).toBeGreaterThan(0);
    expect(dbRecord[0]).toHaveProperty('itemName', updatedItem.itemName);
  });

  test('should return 404 for non-existent item', async () => {
    const nonExistentItemId = 999999;
    const response = await request(app)
    .put(`/changeItem/${nonExistentItemId}`)
    .send({ itemName: "Updated_TEST_id" });

    expect(response.status).toBe(404);

    const dbRecord = await db('items').select('*').where('id', nonExistentItemId);
    expect(dbRecord.length).toBe(0);
  });

  test('should return 500 for invalid input', async () => {
    const invalidItemId = "test string name";
    const response = await request(app)
    .put(`/changeItem/${invalidItemId}`)
    .send({ itemName: "Updated_TEST_id" });
    
    expect(response.status).toBe(500);
  });

  test('should return 400 when updating without sending itemName', async () => {
    const itemId = updatedItem.id;
    const response = await request(app)
    .put(`/changeItem/${itemId}`)
    .send({}); // Empty body

    expect(response.status).toBe(400);
  });

  test('should return 400 when updating with empty itemName', async () => {
    const itemId = updatedItem.id;
    const response = await request(app)
    .put(`/changeItem/${itemId}`)
    .send({ itemName: "" });

    expect(response.status).toBe(400);

    //check if database is unchanged
    const dbRecord = await db('items').select('*').where('id', itemId);
    expect(dbRecord.length).toBeGreaterThan(0);
    expect(dbRecord[0]).toHaveProperty('itemName', updatedItem.itemName);
  });

  test('should update an item ignoring additional fields', async () => {
    const itemId = updatedItem.id;
    const response = await request(app)
    .put(`/changeItem/${itemId}`)
    .send({ itemName: "Updated_itemName", additionalField: "extra" });

    expect(response.status).toBe(200);

    const dbRecord = await db('items').select('*').where('id', itemId);
    expect(dbRecord.length).toBeGreaterThan(0);
    expect(dbRecord[0]).toHaveProperty('itemName', "Updated_itemName");
    expect(dbRecord[0]).not.toHaveProperty('additionalField');
  });

});