import express from 'express';
import { StatusCodes } from 'http-status-codes';
import _ from 'lodash';
import helpers from '../helpers.js';
import interceptors from '../interceptors.js';
import models from '../../models/index.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const page = req.query.page || '1';
  let records, pages, total;
  if (req.user.isInventory || req.user.isAdmin) {
    ({ records, pages, total } = await models.Device.paginate({
      page,
      order: [['id', 'DESC']],
      include: [
        { model: models.Location, attributes: ['name'] },
        { model: models.Donor, attributes: ['name'] },
        { model: models.User, attributes: ['fullName'] },
      ],
    }));
  }

  helpers.setPaginationHeaders(req, res, page, pages, total);
  res.json(records.map((r) => r.toJSON()));
});

router.get('/:id', interceptors.requireInventory, async (req, res) => {
  try {
    const record = await models.Device.findByPk(req.params.id, {
      include: [
        { model: models.Location, attributes: ['name'] },
        { model: models.Donor, attributes: ['name'] },
        { model: models.User, attributes: ['fullName'] },
      ],
    });
    res.json(record);
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
});

router.patch('/:id', interceptors.requireInventory, async (req, res) => {
  try {
    const device = await models.Device.findByPk(req.params.id);
    await device.update(
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
      ]),
    );
    const updatedDevice = await models.Device.findByPk(device.id, {
      include: [
        { model: models.Location, attributes: ['name'] },
        { model: models.Donor, attributes: ['name'] },
      ],
    });
    res.json(updatedDevice);
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
});

router.delete('/:id', interceptors.requireInventory, async (req, res) => {
  try {
    const record = await models.Device.findByPk(req.params.id);
    await record.destroy();
    res.status(StatusCodes.OK).send({ message: 'Device deleted.' }).end();
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: err.original.detail, error: err.original.name }).end();
  }
});

router.post('/', interceptors.requireInventory, async (req, res) => {
  try {
    const device = _.pick(req.body, [
      'LocationId',
      'DonorId',
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
    ]);
    device.UserId = req.user.id;
    const newDevice = await models.Device.create(device);

    const currentDevice = await models.Device.findByPk(newDevice.id, {
      include: [
        {
          model: models.Donor,
          attributes: ['name'],
        },
        {
          model: models.User,
          attributes: ['fullName'],
        },
        { model: models.Location, attributes: ['name'] },
      ],
    });
    res.status(StatusCodes.CREATED).json(currentDevice);
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
});

export default router;
