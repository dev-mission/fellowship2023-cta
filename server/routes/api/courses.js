import express from 'express';
import { StatusCodes } from 'http-status-codes';
import _ from 'lodash';
import helpers from '../helpers.js';

import models from '../../models/index.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const page = req.query.page || '1';
  const { records, pages, total } = await models.Course.paginate({
    page,
  });
  helpers.setPaginationHeaders(req, res, page, pages, total);
  res.json(records.map((r) => r.toJSON()));
});

router.get('/:id', async (req, res) => {
  try {
    const record = await models.Course.findByPk(req.params.id);
    res.json(record.toJSON());
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const record = await models.Course.findByPk(req.params.id);
    await record.update(_.pick(req.body, ['name']));
    res.json(record.toJSON());
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const record = await models.Course.findByPk(req.params.id);
    await record.destroy();
    res.status(StatusCodes.OK).send({ message: 'Course deleted.' }).end();
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: err.original.detail, error: err.original.name }).end();
  }
});

router.post('/', async (req, res) => {
  try {
    const record = await models.Course.create(_.pick(req.body, ['name']));
    res.status(StatusCodes.CREATED).json(record.toJSON());
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
});

export default router;
