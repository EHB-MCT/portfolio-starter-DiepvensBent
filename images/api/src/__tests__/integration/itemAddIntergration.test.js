const request = require('supertest');
const app = require('../../app.js');
const knexfile = require('../../db/knexfile.js'); 
const db = require("knex")(knexfile.development);
const {v4: uuidv4} = require('uuid');

const uuid = uuidv4();
const location={
  name: "testing_location_post",
  uuid: uuid
}
const exampleItem = {
  location_uuid: uuid,
  text: 'TEST_post',

}

let checkItem;

describe('POST /:id', () => {
  beforeAll(async () => {
    const locInsert = await db("locations").insert(location).returning("uuid");   
    const toCheck = await db("items").insert({...exampleItem}).returning("*")
    checkItem = toCheck[0]
  });

  afterAll(async () => {
    await db("locations").delete().where({uuid: checkItem.location_uuid})
    await db("items").delete().where({id: checkItem.id})
    await db.destroy();
  });

  test('should return the correct item record', async () => {
    const response = await request(app)
    .post(`/saveItem`)
    .send(checkItem);

    const itemResponse = response.body.id

    expect(response.status).toBe(200);

    const dbRecord = await db('items').select('*').first().where('id', itemResponse.id);
    expect(dbRecord).toHaveProperty('id',itemResponse.id);
    expect(dbRecord).toHaveProperty('text',checkItem.text);
    expect(dbRecord).toHaveProperty('location_uuid',itemResponse.location_uuid);
  });

  test('should return 401, wrong item record', async () => {
    const response = await request(app)
    .post(`/saveItem`)
    .send({
    ...checkItem,
    text: null
    });
    expect(response.status).toBe(401);
    const itemResponse = response.body.id
    

    // const dbRecord = await db('items').select('*').first().where('text', null);
    // expect(dbRecord.length).toBe(0);
  });

});
