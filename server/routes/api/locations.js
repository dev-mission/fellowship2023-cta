import express from 'express';
import { StatusCodes } from 'http-status-codes';
import _ from 'lodash';

import models from '../../models/index.js';
import helpers from '../helpers.js';

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

// [
//   server-1       | 3:17:00 AM server.1 |    'name',       'parent',
//   server-1       | 3:17:00 AM server.1 |    'original',   'sql',
//   server-1       | 3:17:00 AM server.1 |    'parameters', 'table',
//   server-1       | 3:17:00 AM server.1 |    'fields',     'value',
//   server-1       | 3:17:00 AM server.1 |    'index',      'reltype'
//   server-1       | 3:17:00 AM server.1 |  ]
