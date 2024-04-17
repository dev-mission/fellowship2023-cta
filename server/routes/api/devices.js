import express from 'express';
import { StatusCodes } from 'http-status-codes';
import _ from 'lodash';
import helpers from '../helpers.js';

import models from '../../models/index.js';

const router = express.Router();

router.get('/', async (req, res) => {
  //Need to handle interceptor for inventory role
  const page = req.query.page || '1';
  const {records, pages, total} = await models.Device.paginate({
    page,
    include : [
      {
        model: models.Location,
        attributes: ['name'],

      }],
    });
    helpers.setPaginationHeaders(req, res, page, pages, total);
    res.json(records.map((r) => r.toJSON()));
});

router.get('/:id', async (req, res) => {
  //Need to handle interceptor for inventory role
  try {
    const record = await models.Device.findByPk(req.params.id);
    res.json(record);
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
});

router.patch('/:id', async (req, res) => {
  //Need to handle interceptor for inventory role
  try {
    const deviceId = req.params.id;
    const record = await models.Device.findByPk(deviceId);
    if (!record) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Device not found' });
    }
    await record.update(
      _.pick(req.body, [
        'deviceType',
        'model',
        'brand',
        'serialNum',
        'cpu',
        'ram',
        'os',
        'username',
        'password',
        'condition',
        'value',
        'notes',
      ]),
    );
    res.json(record);
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
});

router.delete('/:id', async (req, res) => {
  //Need to handle interceptor for inventory role
  try {
    const record = await models.Device.findByPk(req.params.id);
    await record.destroy();
    res.status(StatusCodes.OK).end();
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
});

router.post('/', async (req, res) => {
  //Need to handle interceptor for inventory role
  try {
    let device = {};
    let deviceInfo;
    (deviceInfo = _.pick(req.body, [
      'deviceType',
      'model',
      'brand',
      'serialNum',
      'cpu',
      'ram',
      'os',
      'username',
      'password',
      'condition',
      'value',
      'notes',
    ])),
      (device = {
        ...deviceInfo,
        DonorId: req.body.DonorId,
        LocationId: req.body.LocationId,
        UserId: req.body.UserId,
        ClientId: req.body.ClientId,
      });
    const record = await models.Device.create(device);
    res.status(StatusCodes.CREATED).json(record);
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
});

export default router;
