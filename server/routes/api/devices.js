import express from 'express';
import { StatusCodes } from 'http-status-codes';
import _ from 'lodash';
import helpers from '../helpers.js';

import models from '../../models/index.js';

const router = express.Router();

router.get('/', async (req, res) => {
  //Need to handle interceptor for inventory role
  const page = req.query.page || '1';
  const { records, pages, total } = await models.Device.paginate({
    page,
    include: [
      {
        model: models.Location,
        attributes: ['name'],
      },
      {
        model: models.Donor,
        attributes: ['name'],
      },
    ],
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
    const record = await models.Device.findByPk(req.params.id);
    await record.update(_.pick(req.body, ['LocationId', 'DonorId', 'UserId']));
    await record.save();
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
    res.status(StatusCodes.OK).send({});
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
});

router.post('/', async (req, res) => {
 
    try {
      const device = await models.Device.create(
        _.pick(req.body, [
          'LocationId',
          'DonorId',
          'UserId',
          'deviceType',
          'model',
          'brand',
          'serialNum',
          'storage',
          'batteryLastChecked',
          'intern',
          'cpu',
          'ram',
          'os',
          'username',
          'password',
          'condition',
          'value',
          'notes',
          ]));
      
      const currentDevice = await models.Device.findByPk(device.id, {
        include: [
          {
            model: models.Donor,
            attributes: ['name'],
          },
          {
            model: models.User,
            attributes: ['fullName'],
          },
          { model: models.Location,
             attributes: ['name'], 
          },
        ],
      });
      res.status(StatusCodes.CREATED).json(currentDevice);
    } catch (err) {
      console.log(err);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
  });

export default router;
