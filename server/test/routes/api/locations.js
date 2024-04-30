import assert from 'assert';
import { StatusCodes } from 'http-status-codes';
import session from 'supertest-session';

import helper from '../../helper.js';
import app from '../../../app.js';
import models from '../../../models/index.js';

describe('/api/locations', () => {
  let testSession;

  beforeEach(async () => {
    await helper.loadFixtures(['locations', 'users', 'donors', 'clients', 'devices', 'appointments', 'tickets']);
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
    /* 
'name', 'address1', 'address2', 'city', 'state', 'zipCode'
*/
    it('creates a new Location', async () => {
      const response = await testSession
        .post('/api/locations')
        .send({
          name: 'Valencia Gardens',
          address1: '360 Valencia St',
          address2: null,
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94103',
        })
        .expect(StatusCodes.CREATED);

      const record = await models.Location.findByPk(response.body.id);
      assert.deepStrictEqual(record.name, 'Valencia Gardens');
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

    it('Find totalTime spent from march', async () => {
      const response = await testSession.get('/api/locations/totalTime/3');
      assert.deepStrictEqual(response.body[0].name, 'Dev/Mission');
      assert.deepStrictEqual(response.body[0].totalTime, 2);
    });

    it('Fetch all locations vist from march', async () => {
      const response = await testSession.get('/api/locations/vists/3');
      assert.deepStrictEqual(response.body[0].name, 'Dev/Mission');
      assert.deepStrictEqual(response.body[0].vist, 1);
    });
    it('Fetch all locations vist from January', async () => {
      const response = await testSession.get('/api/locations/vists/1');
      assert.deepStrictEqual(response.body[0].name, 'Dev/Mission');
      assert.deepStrictEqual(response.body[0].vist, 0);
    });
  });
});
