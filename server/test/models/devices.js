import assert from 'assert';

import helper from '../helper.js';
import models from '../../models/index.js';

describe('models.Device', () => {
  beforeEach(async () => {
    await helper.loadFixtures(['devices']);
    await helper.loadFixtures(['donors']);
    await helper.loadFixtures(['users']);
    await helper.loadFixtures(['clients']);
  });

  it('creates a new Device record', async () => {
    assert.deepStrictEqual(await models.Device.count(), 4);
    const record = await models.Device.create({
      id: 5,
      DonorId: 5,
      LocationId: 5,
      UserId: 5,
      ClientId: 5,
      deviceType: 'laptop',
      model: 'fixture model test 1',
      brand: 'fixture brand test 1',
      serialNum: 'fixture serial test 1',
      cpu: 'fixture cpu test 1',
      ram: 'fixture ram test 1',
      os: 'fixture os test 1',
      username: 'fixture username test 1',
      password: 'fixture password test 1',
      condition: 'fixture condition test 1',
      value: 99.0,
      notes: 'fixture notes test 1',
    });

    assert.deepStrictEqual(await models.Device.count(), 5);
    assert.deepStrictEqual(record.DonorId, 5);
    assert.deepStrictEqual(record.LocationId, 5);
    assert.deepStrictEqual(record.UserId, 5);
    assert.deepStrictEqual(record.ClientId, 5);
    assert.deepStrictEqual(record.deviceType, 'laptop');
    assert.deepStrictEqual(record.model, 'fixture model test 1');
    assert.deepStrictEqual(record.brand, 'fixture brand test 1');
    assert.deepStrictEqual(record.serialNum, 'fixture serial test 1');
    assert.deepStrictEqual(record.cpu, 'fixture cpu test 1');
    assert.deepStrictEqual(record.ram, 'fixture ram test 1');
    assert.deepStrictEqual(record.os, 'fixture os test 1');
    assert.deepStrictEqual(record.username, 'fixture username test 1');
    assert.deepStrictEqual(record.password, 'fixture password test 1');
    assert.deepStrictEqual(record.condition, 'fixture condition test 1');
    assert.deepStrictEqual(record.value, 99.0);
    assert.deepStrictEqual(record.notes, 'fixture notes test 1');
  });

  it('finds an Device record by ID', async () => {
    const record = await models.Device.findByPk(3);
    assert.deepStrictEqual(record.model, 'fixture model test 1');
    assert.deepStrictEqual(record.brand, 'fixture brand test 1');
    assert.deepStrictEqual(record.value, 450.0);
  });

  it('finds multiple Device records', async () => {
    const record = await models.Device.findAll({
      order: [['serialNum', 'DESC']],
    });

    assert.deepStrictEqual(record.length, 4);
    assert.deepStrictEqual(record[0].serialNum, 'fixture serial test 1');
  });

  it('deletes an Device record', async () => {
    assert.deepStrictEqual(await models.Device.count(), 4);
    const record = await models.Device.findByPk(4);
    await record.destroy();
    assert.deepStrictEqual(await models.Device.count(), 3);
  });
});
