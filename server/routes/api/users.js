import express from 'express';
import { StatusCodes } from 'http-status-codes';
import _ from 'lodash';

import models from '../../models/index.js';
import interceptors from '../interceptors.js';
import helpers from '../helpers.js';
import { Op } from 'sequelize';

const router = express.Router();

router.get('/', interceptors.requireAdmin, async (req, res) => {
  const page = req.query.page || '1';
  const { records, pages, total } = await models.User.paginate({
    include: [{ model: models.Location, attributes: ['name'] }],
    page,
    order: [
      ['lastName', 'ASC'],
      ['firstName', 'ASC'],
      ['email', 'ASC'],
      ['role', 'ASC'],
    ],
  });
  helpers.setPaginationHeaders(req, res, page, pages, total);
  res.json(records.map((r) => r.toJSON()));
});

/*
 * Find totalTime of all users.
 */

router.get('/stats', interceptors.requireAdmin, async (req, res) => {
  const records = await models.User.findAll({
    attributes: ['totalTime'],
  });
  let totalTime = 0;
  records.map((record) => {
    totalTime = totalTime + parseFloat(record.totalTime);
  });
  res.json(totalTime);
});

router.get('/me', (req, res) => {
  if (req.user) {
    res.json(req.user.toJSON());
  } else {
    res.status(StatusCodes.NO_CONTENT).end();
  }
});

router.get('/:id', interceptors.requireLogin, async (req, res) => {
  if (!req.user.isAdmin && req.user.id !== parseInt(req.params.id, 10)) {
    res.status(StatusCodes.UNAUTHORIZED).end();
    return;
  }
  try {
    const user = await models.User.findByPk(req.params.id);
    if (user) {
      res.json(user.toJSON());
    } else {
      res.status(StatusCodes.NOT_FOUND).end();
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
});

router.get('/search/:name', async (req, res) => {
  try {
    const record = await models.User.findAll({
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

router.patch('/:id', interceptors.requireLogin, (req, res) => {
  if (!req.user.isAdmin && req.user.id !== parseInt(req.params.id, 10)) {
    res.status(StatusCodes.UNAUTHORIZED).end();
    return;
  }
  models.sequelize.transaction(async (transaction) => {
    try {
      const user = await models.User.findByPk(req.params.id, { transaction });
      if (!user) {
        res.status(StatusCodes.NOT_FOUND).end();
        return;
      }
      const attrs = ['firstName', 'lastName', 'email', 'password', 'picture'];
      if (req.user.isAdmin) {
        attrs.push('isAdmin');
        attrs.push('role');
      } else if (req.user.role == 'CTA' || req.user.role == 'Inventory') {
        attrs.push('role');
      }
      await user.update(_.pick(req.body, attrs), { transaction });
      res.json(user.toJSON());
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
          status: StatusCodes.UNPROCESSABLE_ENTITY,
          errors: error.errors,
        });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
      }
    }
  });
});

router.delete('/:id', async (req, res) => {
  try {
    const record = await models.User.findByPk(req.params.id);
    await record.destroy();
    res.status(StatusCodes.OK).end();
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
});

export default router;
