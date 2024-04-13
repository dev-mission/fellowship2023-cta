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
  });

  context('Not Authenticated', () => {
    it('fetching entries', async () => {
      await testSession.get('/api/tickets').expect(StatusCodes.UNAUTHORIZED);
    });
    it('fetching single entry', async () => {
      await testSession.get('/api/tickets/1').expect(StatusCodes.UNAUTHORIZED);
    });
    it('updating an entry', async () => {
      await testSession.patch('/api/tickets/1').expect(StatusCodes.UNAUTHORIZED);
    });
    it('deleting an entry', async () => {
      await testSession.delete('/api/tickets/1').expect(StatusCodes.UNAUTHORIZED);
    });
    it('creating an entry', async () => {
      await testSession.post('/api/tickets').expect(StatusCodes.UNAUTHORIZED);
    });
  });

  context('admin authenticated', () => {
    beforeEach(async () => {
      await testSession
        .post('/api/auth/login')
        .set('Accept', 'application/json')
        .send({ email: 'admin.user@test.com', password: 'abcd1234' })
        .expect(StatusCodes.OK);
    });

    it('Delete a ticket', async () => {
      const response = await testSession.delete('/api/tickets/1').expect(StatusCodes.OK);
      const records = await models.Ticket.findByPk(response.body.id);
      assert.deepStrictEqual(records, null);
    });

    it('Update a ticket information', async () => {
      const response = await testSession
        .patch('/api/tickets/1')
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
        .post('/api/tickets')
        .send({
          ClientId: 1,
          LocationId: 1,
          UserId: 1,
          AppointmentId: 3,
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
      assert.deepStrictEqual(records.AppointmentId, 3);
      assert.deepStrictEqual(records.ClientId, 1);
      assert.deepStrictEqual(records.LocationId, 1);
    });

    it('Create a new ticket with no appointment', async () => {
      const response = await testSession
        .post('/api/tickets')
        .send({
          ClientId: 1,
          LocationId: 1,
          UserId: 1,
          serialNumber: '1234567890',
          device: 'TestDevice',
          problem: 'TESTING TICKETS 4',
          troubleshooting: 'TESTING TICKETS 4',
          resolution: 'TESTING TICKETS 4',
          dateOn: '2024-03-05',
          timeInAt: '2024-03-05',
          timeOutAt: '2024-03-05',
          totalTime: 3,
          hasCharger: true,
          notes: 'TESTING TICKETS',
        })
        .expect(StatusCodes.CREATED);
      const records = await models.Ticket.findByPk(response.body.id);
      assert.deepStrictEqual(records.troubleshooting, 'TESTING TICKETS 4');
      assert.deepStrictEqual(records.problem, 'TESTING TICKETS 4');
      assert.deepStrictEqual(records.ClientId, 1);
      assert.deepStrictEqual(records.LocationId, 1);
      assert.deepStrictEqual(records.AppointmentId, null);
    });

    it('fetch all items from the ticket table', async () => {
      await testSession.get('/api/tickets').expect(StatusCodes.OK);
    });

    it('fetch a single item from the ticket table', async () => {
      const response = await testSession.get('/api/tickets/1').expect(StatusCodes.OK);
      assert.deepStrictEqual(response.body?.problem, 'Broken screen');
    });
  });
});
