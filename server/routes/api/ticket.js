import express from 'express';
import { StatusCodes } from 'http-status-codes';
import _ from 'lodash';

import models from '../../models/index.js';

const router = express.Router();

router.get('/', async (req, res) => {
  let tickets = {};
  if (req.user.isAdmin) {
    tickets = await models.Ticket.findAll({ include: [models.Client, models.User, models.Location] });
  } else {
    tickets = await models.Ticket.findAll({
      include: [models.Client, models.User, models.Location],
      where: { UserId: req.user.id },
    });
  }
  res.json(tickets);
});

router.get('/:id', async (req, res) => {
  try {
    const tickets = await models.Ticket.findByPk(req.params.id);
    res.json(tickets);
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const tickets = await models.Ticket.findByPk(req.params.id);
    await tickets.update(
      _.pick(req.body, [
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
    res.json(tickets);
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
});

/*
  Users can only delete their own tickets.
  Admin can delete any ticket.
*/
router.delete('/:id', async (req, res) => {
  try {
    const ticket = await models.Ticket.findByPk(req.params.id);
    if (req.user.isAdmin || ticket.UserId === req.user.id) {
      await ticket.destroy();
      res.status(StatusCodes.OK).end();
    } else {
      res.status(StatusCodes.UNAUTHORIZED).end();
    }
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
});

router.post('/', async (req, res) => {
  try {
    const ticketInfo = _.pick(req.body, [
      'AppointmentId',
      'UserId',
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
    ]);
    const record = await models.Ticket.create(ticketInfo);
    res.status(StatusCodes.CREATED).json(record);
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
});

export default router;
