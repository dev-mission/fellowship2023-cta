import assert from 'assert';
import { StatusCodes } from 'http-status-codes';
import session from 'supertest-session';

import helper from '../../helper.js';
import app from '../../../app.js';
import models from '../../../models/index.js';

describe('/api/donors', () => {
  let testSession;

  beforeEach(async () => {
    await helper.loadFixtures(['donors']);
    testSession = session(app);
  });

  it('creates a new Donor', async () => {
    const response = await testSession.post('/api/donors').send({ name: 'Created Name' }).expect(StatusCodes.CREATED);

    const record = await models.Donor.findByPk(response.body.id);
    assert.deepStrictEqual(record.name, 'Created Name');
  });

  it('fetch all donors from the Courses table', async () => {
    const response = await testSession.get('/api/donors').expect(StatusCodes.OK);
    assert.deepStrictEqual(response.body?.length, 3);
  });

  it('fetch one Donor record from the Donor table', async () => {
    const response = await testSession.get('/api/donors/1').expect(StatusCodes.OK);
    assert.deepStrictEqual(response.body?.name, 'john doe');
  });

  it('updates an existing Donor', async () => {
    await testSession.patch('/api/donors/2').send({ name: 'jane doe 2' }).expect(StatusCodes.OK);
    assert.deepStrictEqual((await models.Donor.findByPk(2)).name, 'jane doe 2');
  });

  it('deletes an existing Donor', async () => {
    await testSession.delete('/api/donors/3').expect(StatusCodes.OK);
    const response = await testSession.get('/api/donors');
    const record = await models.Donor.findByPk(3);
    assert.deepStrictEqual(record, null);
    assert.deepStrictEqual(response.body?.length, 2);
  });
});
