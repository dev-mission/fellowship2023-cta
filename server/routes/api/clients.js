import express from 'express';
import { StatusCodes } from 'http-status-codes';
import _ from 'lodash';

import helpers from '../helpers.js';
import models from '../../models/index.js';
import interceptors from '../interceptors.js';
import { Op } from 'sequelize';

const router = express.Router();

router.get('/', async (req, res) => {
  const page = req.query.page || '1';
  const { records, pages, total } = await models.Client.paginate({
    page,
  });
  helpers.setPaginationHeaders(req, res, page, pages, total);
  res.json(records.map((r) => r.toJSON()));
});

router.get('/:id', async (req, res) => {
  try {
    const record = await models.Client.findByPk(req.params.id);
    res.json(record.toJSON());
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
});

router.get('/search/:name', async (req, res) => {
  try {
    const record = await models.Client.findAll({
      where: {
        [Op.or]: [
          {
            firstName: {
              [Op.like]: `%${req.params.name}%`,
            },
          },
          {
            lastName: {
              [Op.like]: `%${req.params.name}%`,
            },
          },
        ],
      },
    });
    res.json(record);
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const record = await models.Client.findByPk(req.params.id);
    await record.update(_.pick(req.body, ['firstName', 'lastName', 'age', 'phone', 'email', 'ethnicity', 'address', 'gender', 'language']));
    res.json(record.toJSON());
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
});

router.delete('/:id', interceptors.requireAdmin, async (req, res) => {
  try {
    const record = await models.Client.findByPk(req.params.id);
    await record.destroy();
    res.status(StatusCodes.OK).send({ message: 'Client deleted.' }).end();
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: err.original.detail, error: err.original.name }).end();
  }
});

router.post('/', async (req, res) => {
  try {
    const record = await models.Client.create(
      _.pick(req.body, ['firstName', 'lastName', 'age', 'phone', 'email', 'ethnicity', 'address', 'gender', 'language']),
    );
    res.status(StatusCodes.CREATED).json(record.toJSON());
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
});

export default router;
