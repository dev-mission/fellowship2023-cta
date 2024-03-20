import assert from 'assert';

import helper from '../helper.js';
import models from '../../models/index.js';

describe('models.Donor', () => {
  beforeEach(async () => {
    await helper.loadFixtures(['donors']);
  });

  it('creates a new Donor record', async () => {
    assert.deepStrictEqual(await models.Donor.count(), 3);
    const record = await models.Donor.create({
      name: 'Create table',
      phone: '123456789',
      email: 'test@gmail.com',
      address1: 'test address 1',
      address2: 'test address 2',
      city: 'test city',
      state: 'test state',
      zip: '12345',
    });

    assert.deepStrictEqual(await models.Donor.count(), 4);
    assert.deepStrictEqual(record.name, 'Create table');
    assert.deepStrictEqual(record.phone, '123456789');
    assert.deepStrictEqual(record.email, 'test@gmail.com');
    assert.deepStrictEqual(record.address1, 'test address 1');
    assert.deepStrictEqual(record.address2, 'test address 2');
    assert.deepStrictEqual(record.city, 'test city');
    assert.deepStrictEqual(record.state, 'test state');
    assert.deepStrictEqual(record.zip, '12345');
  });

  it('finds an Donor record by ID', async () => {
    const record = await models.Donor.findByPk(1);
    assert.deepStrictEqual(record.name, 'john doe');
    assert.deepStrictEqual(record.phone, '123456789');
    assert.deepStrictEqual(record.email, 'johndoe@email.com');
    assert.deepStrictEqual(record.address1, '1234 main st');
    assert.deepStrictEqual(record.address2, 'apt 123');
    assert.deepStrictEqual(record.city, 'anytown');
    assert.deepStrictEqual(record.state, 'NY');
    assert.deepStrictEqual(record.zip, '12345');
  });

  it('finds multiple Donor records', async () => {
    const record = await models.Donor.findAll({
      order: [['name', 'DESC']],
    });

    assert.deepStrictEqual(record.length, 3);
    assert.deepStrictEqual(record[0].name, 'john doe');
  });

  it('deletes an Donor record', async () => {
    assert.deepStrictEqual(await models.Donor.count(), 3);
    const record = await models.Donor.findByPk(3);
    await record.destroy();
    assert.deepStrictEqual(await models.Donor.count(), 2);
  });
});
