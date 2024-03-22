import assert from 'assert';
import { StatusCodes } from 'http-status-codes';
import session from 'supertest-session';

import helper from '../../helper.js';
import app from '../../../app.js';
import models from '../../../models/index.js';

describe('/api/courses', () => {
  let testSession;

  beforeEach(async () => {
    await helper.loadFixtures(['locations', 'users', 'courses']);
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

    it('creates a new Course', async () => {
      const response = await testSession.post('/api/courses').send({ name: 'Created Name' }).expect(StatusCodes.CREATED);

      const record = await models.Course.findByPk(response.body.id);
      assert.deepStrictEqual(record.name, 'Created Name');
    });

    it('fetch all courses from the Courses table', async () => {
      const response = await testSession.get('/api/courses').expect(StatusCodes.OK);
      assert.deepStrictEqual(response.body?.length, 3);
    });

    it('fetch one course record from the Course table', async () => {
      const response = await testSession.get('/api/courses/1001').expect(StatusCodes.OK);
      assert.deepStrictEqual(response.body?.name, 'Fixture Course 1001');
    });

    it('updates an existing Course', async () => {
      await testSession.patch('/api/courses/1001').send({ name: 'Updated Name' }).expect(StatusCodes.OK);
    });

    it('deletes an existing Course', async () => {
      await testSession.delete('/api/courses/1001').expect(StatusCodes.OK);

      const record = await models.Course.findByPk(1001);
      assert.deepStrictEqual(record, null);
    });
  });
});
