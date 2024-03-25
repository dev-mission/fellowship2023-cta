import assert from 'assert';
import { StatusCodes } from 'http-status-codes';
import session from 'supertest-session';

import helper from '../../helper.js';
import app from '../../../app.js';
import models from '../../../models/index.js';

describe('/api/clients', () => {
  let testSession;

  beforeEach(async () => {
    await helper.loadFixtures(['locations', 'users', 'clients']);
    testSession = session(app);
  });

  context('admin authenticated', () => {
    beforeEach(async () => {
      await testSession
        .post('/api/auth/login')
        .set('Accept', 'application/json')
        .send({ email: 'admin.user@test.com', password: 'abcd1234' })
        .expect(StatusCodes.OK);
    });

    it('creates a new Client', async () => {
      const response = await testSession
        .post('/api/clients')
        .send({
          firstName: 'Created First Name',
          lastName: 'Created Last Name',
          age: 20,
          phone: '123-456-7890',
          email: 'created@email.com',
          ethnicity: 'Created Ethnicity',
          address: 'Created Address',
          gender: 'Created Gender',
          language: 'Created Language',
        })
        .expect(StatusCodes.CREATED);

      const record = await models.Client.findByPk(response.body.id);
      assert.deepStrictEqual(record.firstName, 'Created First Name');
      assert.deepStrictEqual(record.email, 'created@email.com');
    });

    it('fetch all clients from the Clients table', async () => {
      const response = await testSession.get('/api/clients').expect(StatusCodes.OK);
      assert.deepStrictEqual(response.body?.length, 5);
    });

    it('fetch one client record from the Client table', async () => {
      const response = await testSession.get('/api/clients/1001').expect(StatusCodes.OK);
      assert.deepStrictEqual(response.body?.firstName, 'Fixture Client First Name 1');
    });

    it('updates an existing Client', async () => {
      const response = await testSession
        .patch('/api/clients/1001')
        .send({ firstName: 'Updated First Name', phone: '444-444-4444' })
        .expect(StatusCodes.OK);

      const record = await models.Client.findByPk(response.body.id);
      assert.deepStrictEqual(record.firstName, 'Updated First Name');
      assert.deepStrictEqual(record.email, 'fixturetest1@email.com');
      assert.deepStrictEqual(record.phone, '444-444-4444');
    });

    it('deletes an existing Client', async () => {
      await testSession.delete('/api/clients/1001').expect(StatusCodes.OK);

      const record = await models.Client.findByPk(1001);
      assert.deepStrictEqual(record, null);
    });
  });
});
