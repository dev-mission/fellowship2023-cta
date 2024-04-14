import express from 'express';
import { StatusCodes } from 'http-status-codes';
import _ from 'lodash';

import models from '../../models/index.js';
import interceptors from '../interceptors.js';

const router = express.Router();

router.get('/', async (req, res) => {
  let tickets;
  if (req.user.isAdmin) {
    tickets = await models.Ticket.findAll({
      include: [
        { model: models.Client, attributes: ['fullName'] },
        { model: models.User, attributes: ['fullName'] },
        { model: models.Location, attributes: ['name'] },
      ],
    });
  } else {
    tickets = await models.Ticket.findAll({
      include: [
        { model: 'Client', attributes: ['fullName'] },
        { model: 'User', attributes: ['fullName'] },
        { model: 'Location', attributes: ['name'] },
      ],
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
    res.status(StatusCodes.CREATED).json(ticket);
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
});

export default router;
