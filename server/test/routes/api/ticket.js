import assert from 'assert';
import { StatusCodes } from 'http-status-codes';
import _ from 'lodash';
import session from 'supertest-session';
import helper from '../../helper.js';
import models from "../../../models/index.js"
import app from '../../../app.js';

describe('/api/ticket', () => {
  let testSession;

  beforeEach(async () => {
    await helper.loadFixtures(["tickets"]);
    testSession = session(app);
  });

  it("Delete a ticket", async () => {
    const response = await testSession.delete('/api/ticket/1').expect(StatusCodes.OK);
    const records = await models.Restaurant.findByPk(response.body.id);
    console.log(response);
    assert.deepStrictEqual(records, null);
  });

  it("Update a ticket information", async () => {
    const response = await testSession.patch('/api/ticket/1').send({
        problem: "Retested Probolem",
        troubleshooting: "Retested Troubleshooting",
    }).expect(StatusCodes.OK);
    const records = await models.Restaurant.findByPk(response.body.id);
    assert.deepStrictEqual(records.problem, "Retested Probolem");
    assert.deepStrictEqual(records.troubleshooting, "Retested Troubleshooting");
  });

  it("Create a new ticket", async () => { 
    const response = await testSession.post('/api/ticket').send({
      "AppointmentId": 1,
      "ClientId": 1,
      "LocationId": 1,
      "UserId": 1,
      "DeviceId": 1,
      "problem": "TESTING TICKETS 3",
      "troubleshooting": "TESTING TICKETS 3",
      "resolution": "TESTING TICKETS 3",
      "dateOn": "2024-03-04",
      "timeInAt": "2024-03-04",
      "timeOutAt": "2024-03-04",
      "totalTime": "2024-03-04",
      "hasCharger": true,
      "notes": "TESTING TICKETS"
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
    assert.deepStrictEqual(response.body?.problem, "Broken screen");
  });
});