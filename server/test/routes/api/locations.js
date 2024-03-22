import assert from 'assert';
import { StatusCodes } from 'http-status-codes';
import session from 'supertest-session';

import helper from '../../helper.js';
import app from '../../../app.js';
import models from '../../../models/index.js';

describe('/api/locations', () => {
  let testSession;

  beforeEach(async () => {
    await helper.loadFixtures(['locations', 'users']);
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

    it('creates a new Location', async () => {
      const response = await testSession.post('/api/locations').send({ name: 'Created Name' }).expect(StatusCodes.CREATED);

      const record = await models.Location.findByPk(response.body.id);
      assert.deepStrictEqual(record.name, 'Created Name');
    });

    it('fetch all locations from the Locations table', async () => {
      const response = await testSession.get('/api/locations').expect(StatusCodes.OK);
      assert.deepStrictEqual(response.body?.length, 6);
    });

    it('fetch one location record from the Location table', async () => {
      const response = await testSession.get('/api/locations/222').expect(StatusCodes.OK);
      assert.deepStrictEqual(response.body?.name, 'fixture name test 2');
    });

    it('updates an existing Location', async () => {
      await testSession.patch('/api/locations/111').send({ name: 'Updated Name' }).expect(StatusCodes.OK);
    });

    it('deletes an existing Locatiion', async () => {
      await testSession.delete('/api/locations/111').expect(StatusCodes.OK);

      const record = await models.Location.findByPk(111);
      assert.deepStrictEqual(record, null);
    });
  });
});
