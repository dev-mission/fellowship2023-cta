import express from 'express';
import { StatusCodes } from 'http-status-codes';
import _ from 'lodash';

import models from '../../models/index.js';
import helpers from '../helpers.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const page = req.query.page || '1';
  const { records, pages, total } = await models.Donor.paginate({
    page,
    order: [
      ['name', 'ASC'],
      ['phone', 'ASC'],
      ['email', 'ASC'],
      ['address1', 'ASC'],
      ['address2', 'ASC'],
      ['city', 'ASC'],
      ['state', 'ASC'],
      ['zip', 'ASC'],
    ],
  });
  helpers.setPaginationHeaders(req, res, page, pages, total);
  res.json(records.map((r) => r.toJSON()));
});

router.get('/:id', async (req, res) => {
  try {
    const record = await models.Donor.findByPk(req.params.id);

    res.json(record);
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
});
router.get('/:donor', async (req, res) => {
  try {
    const record = await models.Donor.findOne(req.params.donor);
    res.json(record);
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const record = await models.Donor.findByPk(req.params.id);
    await record.update(_.pick(req.body, ['name', 'phone', 'email', 'address1', 'address2', 'city', 'state', 'zip']));
    res.json(record);
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const record = await models.Donor.findByPk(req.params.id);
    await record.destroy();
    res.status(StatusCodes.OK).send({ message: 'Donor deleted.' }).end();
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: err.original.detail, error: err.original.name }).end();
  }
});

router.post('/', async (req, res) => {
  try {
    const record = await models.Donor.create(_.pick(req.body, ['name', 'phone', 'email', 'address1', 'address2', 'city', 'state', 'zip']));
    res.status(StatusCodes.CREATED).json(record);
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
});

export default router;
