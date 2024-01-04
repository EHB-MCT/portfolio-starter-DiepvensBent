const request = require('supertest');
const app = require('../../app.js');
const knexfile = require('../../db/knexfile.js'); 
const db = require("knex")(knexfile.development);
const {v4: uuidv4} = require('uuid');

const location = {
  name: "testing_location_post",
  uuid: uuidv4()
}

const exampleItem = {
  location_uuid: location.uuid,
  text: 'TEST_post',
}

describe('POST /saveItem', () => {
  beforeAll(async () => {
    await db("locations").insert(location).returning("uuid");   
  });

  afterAll(async () => {
    await db("locations").delete().where({uuid: exampleItem.location_uuid});
    await db.destroy();
  });

  test('should return 200, correct item record', async () => {
    const response = await request(app)
    .post(`/saveItem`)
    .send(exampleItem);

    const itemResponse = response.body[0];
    expect(response.status).toBe(200);

    const dbRecord = await db('items').select('*').first().where('id', itemResponse.id);
    expect(dbRecord).toHaveProperty('id',itemResponse.id);
    expect(dbRecord).toHaveProperty('text',exampleItem.text);
    expect(dbRecord).toHaveProperty('location_uuid',exampleItem.location_uuid);
  });

  test('should return 400, wrong item record', async () => {
    const response = await request(app)
    .post(`/saveItem`)
    .send({...exampleItem, text: null});

    expect(response.status).toBe(400);
    
    const dbRecord = await db('items').select('*').where('text', null);
    expect(dbRecord.length).toBe(0);
  });

  test('should return 400 when text property is missing', async () => {
    const response = await request(app)
    .post('/saveItem')
    .send({}); // Empty body

    expect(response.status).toBe(400);
  });

  test('should return 400 when text property is an empty string', async () => {
    const response = await request(app)
    .post('/saveItem')
    .send({ text: ""});

    expect(response.status).toBe(400);
  });

  test('should return 400 for invalid text property', async () => {
    const invalidText = 123; // Use a non-string value
    const response = await request(app)
    .post('/saveItem')
    .send({ text: invalidText });

    expect(response.status).toBe(400);
  });
});
