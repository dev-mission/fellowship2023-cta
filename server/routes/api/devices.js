import express from 'express';
import { StatusCodes } from 'http-status-codes';
import _ from 'lodash';

import models from '../../models/index.js';
import interceptors from '../interceptors.js';

const router = express.Router();

router.get('/', interceptors.requireAdmin, async (req, res) => {
  const records = await models.Device.findAll();
  res.json(records);
});

router.get('/:id', async (req, res) => {
  try {
    const record = await models.Device.findByPk(req.params.id);
    res.json(record);
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
});

router.patch('/:id', interceptors.requireAdmin, async (req, res) => {
  try {
    const deviceId = req.params.id;
    const record = await models.Device.findByPk(deviceId, {
        include: [
          { model: models.Donor },
          { model: models.Location },
          { model: models.User },
          { model: models.Client }
        ]
      });
    if (!record) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: 'Device not found' });
    }
    await record.update(_.pick(req.body, ['deviceType', 'model', 'brand', 'serialNum', 'cpu', 'ram', 'os', 'username', 'password', 'condition', 'value', 'notes']));
    res.json(record);
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
});

router.delete('/:id', interceptors.requireAdmin, async (req, res) => {
  try {
    const record = await models.Device.findByPk(req.params.id);
    await record.destroy();
    res.status(StatusCodes.OK).end();
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
});

router.post('/', interceptors.requireAdmin, async (req, res) => {
  try {
    const record = await models.Device.create(
      _.pick(req.body, ['deviceType', 'model', 'brand', 'serialNum', 'cpu', 'ram', 'os', 'username', 'password', 'condition', 'value', 'notes']),
    );

    if (req.body.donorId) {
        await newDevice.setDonor(req.body.donorId);
    }
    if (req.body.locationId) {
        await newDevice.setLocation(req.body.locationId);
    }
    if (req.body.userId) {
        await newDevice.setUser(req.body.userId);
    }
    if (req.body.clientId) {
        await newDevice.setClient(req.body.clientId);
    }

    res.status(StatusCodes.CREATED).json(record);
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
});

export default router;
