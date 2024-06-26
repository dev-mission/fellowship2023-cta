import express from 'express';
import { StatusCodes } from 'http-status-codes';
import _ from 'lodash';
import { DateTime } from 'luxon';
import models from '../../models/index.js';
import helpers from '../helpers.js';
import { Op } from 'sequelize';
import interceptors from '../interceptors.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const page = req.query.page || '1';
  const { records, pages, total } = await models.Location.paginate({
    page,
  });
  helpers.setPaginationHeaders(req, res, page, pages, total);
  res.json(records.map((r) => r.toJSON()));
});

router.get('/totalTime/:month', interceptors.requireAdmin, async (req, res) => {
  const month = req.params.month;
  const dateFrom = DateTime.fromObject({ month: month, day: 1 }).toISODate();
  const dateTo = DateTime.fromObject({ month: month, day: 1 }).plus({ months: 1 }).toISODate();
  const locations = await models.Location.findAll({ attributes: ['id', 'name'], raw: true });
  const updatedLocations = await Promise.all(
    locations.map(async (item) => {
      const tickets = await models.Ticket.findAll({
        where: {
          LocationId: item.id,
          dateOn: {
            [Op.between]: [dateFrom, dateTo],
          },
        },
      });
      let totalTime = 0;
      tickets.forEach((ticket) => {
        totalTime += ticket.totalTime;
      });
      return { ...item, totalTime };
    }),
  );
  res.json(updatedLocations);
});

router.get('/vists/:month', interceptors.requireAdmin, async (req, res) => {
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

router.patch('/:id', interceptors.requireAdmin, async (req, res) => {
  try {
    const record = await models.Location.findByPk(req.params.id);
    await record.update(_.pick(req.body, ['name', 'address1', 'address2', 'city', 'state', 'zipCode']));
    res.json(record);
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
});

router.delete('/:id', interceptors.requireAdmin, async (req, res) => {
  try {
    const record = await models.Location.findByPk(req.params.id);
    await record.destroy();
    res.status(StatusCodes.OK).send({ message: 'Location deleted.' }).end();
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: err.original.detail, error: err.original.name }).end();
  }
});

router.post('/', interceptors.requireAdmin, async (req, res) => {
  try {
    const record = await models.Location.create(_.pick(req.body, ['name', 'address1', 'address2', 'city', 'state', 'zipCode']));
    res.status(StatusCodes.CREATED).json(record);
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
});

export default router;
