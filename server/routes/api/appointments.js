import express from 'express';
import { StatusCodes } from 'http-status-codes';
import _ from 'lodash';

import models from '../../models/index.js';
import helpers from '../helpers.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const page = req.query.page || '1';
  const { records, pages, total } = await models.Appointment.paginate({
    page,
    include: [
      {
        model: models.Client,
        attributes: ['phone', 'email', 'language', 'fullName'],
        include: {
          model: models.Device,
          attributes: ['model'],
        },
      },
      {
        model: models.User,
        attributes: ['firstName', 'lastName'],
      },
      { model: models.Location, attributes: ['name'] },
    ],
  });
  helpers.setPaginationHeaders(req, res, page, pages, total);
  res.json(records.map((r) => r.toJSON()));
});

router.get('/:id', async (req, res) => {
  try {
    const record = await models.Appointment.findByPk(req.params.id);
    res.json(record);
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
});

router.get('/:appointment', async (req, res) => {
  try {
    const record = await models.Appointment.findOne(req.params.appointment);
    res.json(record);
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const record = await models.Appointment.findByPk(req.params.id);
    await record.update(_.pick(req.body, ['ClientId', 'UserId', 'LocationId', 'state', 'zipCode']));
    res.json(record);
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
});

export default router;