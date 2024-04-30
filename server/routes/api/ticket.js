import express from 'express';
import { StatusCodes } from 'http-status-codes';
import _ from 'lodash';

import models from '../../models/index.js';
import interceptors from '../interceptors.js';

import helpers from '../helpers.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const page = req.query.page || '1';
  let records, pages, total;
  if (req.user.isAdmin) {
    ({ records, pages, total } = await models.Ticket.paginate({
      page,
      order: [
        ['id', 'ASC'],
        ['dateOn', 'ASC'],
        ['timeInAt', 'ASC'],
      ],
      include: [
        { model: models.Client, attributes: ['fullName'] },
        { model: models.User, attributes: ['fullName'] },
        { model: models.Location, attributes: ['name'] },
      ],
    }));
  } else {
    ({ records, pages, total } = await models.Ticket.paginate({
      page,
      order: [
        ['id', 'DESC'],
        ['dateOn', 'DESC'],
        ['timeInAt', 'DESC'],
      ],
      include: [
        { model: models.Client, attributes: ['fullName'] },
        { model: models.User, attributes: ['fullName'] },
        { model: models.Location, attributes: ['name'] },
      ],
      where: { UserId: req.user.id },
    }));
  }
  helpers.setPaginationHeaders(req, res, page, pages, total);
  res.json(records.map((t) => t.toJSON()));
});

router.get('/:id', interceptors.requireCTA, async (req, res) => {
  try {
    const tickets = await models.Ticket.findByPk(req.params.id, {
      include: [
        { model: models.Client, attributes: ['fullName'] },
        { model: models.Location, attributes: ['name'] },
      ],
    });
    res.json(tickets);
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
});

/*
Need to figure out how to update time based on patching.
*/

router.patch('/:id', interceptors.requireCTA, async (req, res) => {
  try {
    const ticket = await models.Ticket.findByPk(req.params.id);
    // const oldTotalTime = ticket.totalTime;
    await ticket.update(
      _.pick(req.body, [
        'AppointmentId',
        'ClientId',
        'LocationId',
        'device',
        'problem',
        'troubleshooting',
        'resolution',
        'dateOn',
        'timeInAt',
        'timeOutAt',
        'totalTime',
        'hasCharger',
        'notes',
      ]),
    );
    const updatedTicket = await models.Ticket.findByPk(ticket.id, {
      include: [
        { model: models.Client, attributes: ['fullName'] },
        { model: models.User, attributes: ['fullName'] },
        { model: models.Location, attributes: ['name'] },
      ],
    });
    // const user = await models.User.findByPk(ticket.UserId);
    // const newTotalTime = parseFloat(user.totalTime) - oldTotalTime + updatedTicket.totalTime;
    // user.update({ totalTime: newTotalTime });
    // user.save();
    res.json(updatedTicket);
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
});

/*
  Users can only delete their own tickets.
  Admin can delete any ticket.
*/
router.delete('/:id', interceptors.requireCTA, async (req, res) => {
  try {
    const ticket = await models.Ticket.findByPk(req.params.id);
    if (req.user.isAdmin || ticket.UserId === req.user.id) {
      const user = await models.User.findByPk(ticket.UserId);
      const newTime = parseFloat(user.totalTime) - ticket.totalTime;
      user.update({ totalTime: newTime });
      user.save();
      await ticket.destroy();
      res.status(StatusCodes.OK).send({ message: 'Ticket deleted' }).end();
    } else {
      res.status(StatusCodes.UNAUTHORIZED).end();
    }
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: err.original.detail, error: err.original.name }).end();
  }
});

router.post('/', interceptors.requireCTA, async (req, res) => {
  try {
    const ticketInfo = _.pick(req.body, [
      'AppointmentId',
      'LocationId',
      'ClientId',
      'ticketType',
      'serialNumber',
      'AppointmentId',
      'device',
      'problem',
      'troubleshooting',
      'resolution',
      'dateOn',
      'timeInAt',
      'timeOutAt',
      'totalTime',
      'hasCharger',
      'notes',
      'timeZone',
    ]);
    ticketInfo.UserId = req.user.id;
    const record = await models.Ticket.create(ticketInfo);
    const ticket = await models.Ticket.findByPk(record.id, {
      include: [
        { model: models.Client, attributes: ['fullName'] },
        { model: models.User, attributes: ['fullName'] },
        { model: models.Location, attributes: ['name'] },
      ],
    });
    const user = await models.User.findByPk(req.user.id);
    const newTime = parseFloat(user.totalTime) + ticket.totalTime;
    user.update({ totalTime: newTime });
    user.save();
    res.status(StatusCodes.CREATED).json(ticket);
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
});

export default router;
