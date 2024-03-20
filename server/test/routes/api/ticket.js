import assert from 'assert';
import { StatusCodes } from 'http-status-codes';
import session from 'supertest-session';
import helper from '../../helper.js';
import models from '../../../models/index.js';
import app from '../../../app.js';

describe('/api/ticket', () => {
  let testSession;

  beforeEach(async () => {
    await helper.loadFixtures(['locations', 'users', 'donors', 'clients', 'devices', 'appointments', 'tickets']);
    testSession = session(app);
    await testSession
      .post('/api/auth/login')
      .set('Accept', 'application/json')
      .send({ email: 'admin.user@test.com', password: 'abcd1234' })
      .expect(StatusCodes.OK);
  });

  it('Delete a ticket', async () => {
    const response = await testSession.delete('/api/ticket/1').expect(StatusCodes.OK);
    const records = await models.Ticket.findByPk(response.body.id);
    assert.deepStrictEqual(records, null);
  });

  it('Update a ticket information', async () => {
    const response = await testSession
      .patch('/api/ticket/1')
      .send({
        problem: 'Retested Probolem',
        troubleshooting: 'Retested Troubleshooting',
      })
      .expect(StatusCodes.OK);
    const records = await models.Ticket.findByPk(response.body.id);
    assert.deepStrictEqual(records.problem, 'Retested Probolem');
    assert.deepStrictEqual(records.troubleshooting, 'Retested Troubleshooting');
  });

  it('Create a new ticket with existing client', async () => {
    const response = await testSession
      .post('/api/ticket')
      .send({
        AppointmentId: 3,
        ClientId: 1,
        LocationId: 1,
        UserId: 1,
        serialNumber: '1234567890',
        device: 'TestDevice',
        problem: 'TESTING TICKETS 3',
        troubleshooting: 'TESTING TICKETS 3',
        resolution: 'TESTING TICKETS 3',
        dateOn: '2024-03-04',
        timeInAt: '2024-03-04',
        timeOutAt: '2024-03-04',
        totalTime: 8,
        hasCharger: true,
        notes: 'TESTING TICKETS',
      })
      .expect(StatusCodes.CREATED);
    const records = await models.Ticket.findByPk(response.body.id);
    assert.deepStrictEqual(records.troubleshooting, 'TESTING TICKETS 3');
    assert.deepStrictEqual(records.problem, 'TESTING TICKETS 3');
    assert.deepStrictEqual(records.ClientId, 1);
    assert.deepStrictEqual(records.AppointmentId, 3);
    assert.deepStrictEqual(records.LocationId, 1);
  });

  it('Create a new ticket without existing client', async () => {
    const response = await testSession
      .post('/api/ticket')
      .send({
        firstName: 'Link',
        lastName: 'Zelda',
        email: 'newEmail@email.com',
        phone: '415-999-9999',
        address: 'new wales',
        ethnicity: 'N/A',
        language: 'English',
        gender: 'Male',
        age: '21',
        AppointmentId: 3,
        LocationId: 1,
        UserId: 1,
        serialNumber: '1234567890',
        device: 'TestDevice',
        problem: 'TESTING TICKETS 3',
        troubleshooting: 'TESTING TICKETS 3',
        resolution: 'TESTING TICKETS 3',
        dateOn: '2024-03-04',
        timeInAt: '2024-03-04',
        timeOutAt: '2024-03-04',
        totalTime: 8,
        hasCharger: true,
        notes: 'TESTING TICKETS',
      })
      .expect(StatusCodes.CREATED);
    const records = await models.Ticket.findByPk(response.body.id);
    const client = await models.Client.findByPk(response.body.ClientId);
    assert.deepStrictEqual(client.firstName, 'Link');
    assert.deepStrictEqual(client.lastName, 'Zelda');
    assert.deepStrictEqual(client.id === records.ClientId, true);
  });

  it('fetch all items from the ticket table', async () => {
    await testSession.get('/api/ticket').expect(StatusCodes.OK);
  });

  it('fetch a single item from the ticket table', async () => {
    const response = await testSession.get('/api/ticket/1').expect(StatusCodes.OK);
    assert.deepStrictEqual(response.body?.problem, 'Broken screen');
  });
});
