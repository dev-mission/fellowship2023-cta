import express from 'express';
import { StatusCodes } from 'http-status-codes';
import _ from 'lodash';
import { DateTime } from 'luxon';
import models from '../../models/index.js';
import helpers from '../helpers.js';
import { Op } from 'sequelize';

const router = express.Router();

router.get('/', async (req, res) => {
  const page = req.query.page || '1';
  const { records, pages, total } = await models.Location.paginate({
    page,
    order: [
      ['name', 'ASC'],
      ['address1', 'ASC'],
      ['address2', 'ASC'],
      ['city', 'ASC'],
      ['state', 'ASC'],
      ['zipCode', 'ASC'],
    ],
  });
  helpers.setPaginationHeaders(req, res, page, pages, total);
  res.json(records.map((r) => r.toJSON()));
});

router.get('/vists/:month', async (req, res) => {
  const month = req.params.month;
  const dateFrom = DateTime.fromObject({ month: month, day: 1 }).toISODate();
  const dateTo = DateTime.fromObject({ month: month, day: 1 }).plus({ months: 1 }).toISODate();
  const locations = await models.Location.findAll({ attributes: ['id', 'name'], raw: true });
  const updatedLocations = await Promise.all(
    locations.map(async (item) => {
      const vist = await models.Ticket.count({
        where: {
          LocationId: item.id,
          dateOn: {
            [Op.between]: [dateFrom, dateTo],
          },
        },
      });
      return { ...item, vist };
    }),
  );
  res.json(updatedLocations);
});

router.get('/:id', async (req, res) => {
  try {
    const record = await models.Location.findByPk(req.params.id);
    res.json(record);
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
});

router.get('/:location', async (req, res) => {
  try {
    const record = await models.Location.findOne(req.params.location);
    res.json(record);
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const record = await models.Location.findByPk(req.params.id);
    await record.update(_.pick(req.body, ['name', 'address1', 'address2', 'city', 'state', 'zipCode']));
    res.json(record);
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const record = await models.Location.findByPk(req.params.id);
    await record.destroy();
    res.status(StatusCodes.OK).send({ message: 'Location deleted.' }).end();
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: err.original.detail, error: err.original.name }).end();
  }
});

router.post('/', async (req, res) => {
  try {
    const record = await models.Location.create(_.pick(req.body, ['name', 'address1', 'address2', 'city', 'state', 'zipCode']));
    res.status(StatusCodes.CREATED).json(record);
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
});

export default router;
