import assert from 'assert';
import { StatusCodes } from 'http-status-codes';
import _ from 'lodash';
import session from 'supertest-session';
import helper from '../../helper.js';
import models from "../../../models/index.js"
import app from '../../../app.js';

describe('/api/restaurant', () => {
  let testSession;

  beforeEach(async () => {
    await helper.loadFixtures(["tickets"]);
    testSession = session(app);
  });

  it("Delete a ticket", async () => {
    const response = await testSession.delete('/api/ticket/1').expect(StatusCodes.OK);
    const records = await models.Restaurant.findByPk(response.body.id);
    assert.deepStrictEqual(records, null);
  });

  it("Update a ticket information", async () => {
    const response = await testSession.patch('/api/ticket/1').send({
      Name: "Hello World",
      Location: "temp",
      Rating: 3,
      Comment: "It's a restaurant",
      Map: "https://goo.gl/maps/123"
    }).expect(StatusCodes.OK);
    const records = await models.Restaurant.findByPk(response.body.id);
    assert.deepStrictEqual(records.Name, "Hello World");
    assert.deepStrictEqual(records.Location, "temp");
  });

  it("Create a new ticket", async () => { 
    const response = await testSession.post('/api/ticket').send({
      Name: "Hello World",
      Location: "temp",
      Rating: 3,
      Comment: "It's a restaurant",
      Map: "https://goo.gl/maps/123"
    }).expect(StatusCodes.CREATED);
    const records = await models.Restaurant.findByPk(response.body.id);
    assert.deepStrictEqual(records.Name, "Hello World");
    assert.deepStrictEqual(records.Location, "temp");

  });

  it("fetch all items from the ticket table", async () => {
    const response = await testSession.get('/api/ticket').expect(StatusCodes.OK);
  });

  it("fetch a single item from the ticket table", async () => {
    const response = await testSession.get('/api/ticket/1').expect(StatusCodes.OK);
    assert.deepStrictEqual(response.body?.Name, "Applebee's");
  });
});