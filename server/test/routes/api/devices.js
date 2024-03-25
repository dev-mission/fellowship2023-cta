import assert from 'assert';
import { StatusCodes } from 'http-status-codes';
import session from 'supertest-session';
import helper from '../../helper.js';
import models from '../../../models/index.js';
import app from '../../../app.js';

describe('/api/devices', () => {
  let testSession;

  beforeEach(async () => {
    await helper.loadFixtures(['donors', 'locations', 'clients', 'users', 'devices']);

    testSession = session(app);
    //Need to handle interceptor for inventory role
  });

  it('Delete a device', async () => {
    const response = await testSession.delete('/api/devices/1').expect(StatusCodes.OK);
    const records = await models.Device.findByPk(response.body.id);
    assert.deepStrictEqual(records, null);
  });

  it('Update a device information', async () => {
    const response = await testSession
      .patch('/api/devices/1')
      .send({
        serialNum: '0987654321',
        ram: '32GB',
      })
      .expect(StatusCodes.OK);
    const records = await models.Device.findByPk(response.body.id);
    assert.deepStrictEqual(records.serialNum, '0987654321');
    assert.deepStrictEqual(records.ram, '32GB');
  });

  it('Create a new device', async () => {
    const response = await testSession
      .post('/api/devices')
      .send({
        DonorId: 2,
        LocationId: 2,
        UserId: 2,
        ClientId: 2,
        deviceType: 'Desktop',
        model: 'test model',
        brand: 'test brand',
        serialNum: 'test serial number',
        cpu: 'test cpu',
        ram: 'test ram GB',
        os: 'test os',
        username: 'test username',
        password: 'test password',
        condition: 'test condition',
        value: 199.99,
        notes: 'test notes',
      })
      .expect(StatusCodes.CREATED);
    const records = await models.Device.findByPk(response.body.id);
    assert.deepStrictEqual(records.model, 'test model');
    assert.deepStrictEqual(records.serialNum, 'test serial number');
    assert.deepStrictEqual(records.ClientId, 2);
    assert.deepStrictEqual(records.DonorId, 2);
    assert.deepStrictEqual(records.LocationId, 2);
  });

  it('fetch all items from the device table', async () => {
    await testSession.get('/api/devices').expect(StatusCodes.OK);
  });

  it('fetch a single item from the device table', async () => {
    const response = await testSession.get('/api/devices/1').expect(StatusCodes.OK);
    assert.deepStrictEqual(response.body?.condition, 'Good');
  });
});
