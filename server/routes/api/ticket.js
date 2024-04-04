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

/*
  User will send a post request with the following body:
  
  {
      Ticket.belongsTo(models.Client);
      Ticket.belongsTo(models.Location);
      UserId: Models.User.id, // This is the user who is creating the ticket.
      Ticket.belongsTo(models.Device); // If This device exist in the inventory use this.
      device: DataTypes.TEXT,
      problem: DataTypes.TEXT,
      troubleshooting: DataTypes.TEXT,
      resolution: DataTypes.TEXT,
      dateOn: DataTypes.DATE,
      timeInAt: DataTypes.DATE,
      timeOutAt: DataTypes.DATE,
      totalTime: DataTypes.INTEGER,
      hasCharger: DataTypes.BOOLEAN,
      notes: DataTypes.TEXT,

  }

  Situations
  No ClientId:  use a Client Model
*/
router.post('/', async (req, res) => {
  try {
    let ticket = {};
    let ticketInfo;
    let clientInfo = {};
    //
    if (req.body.ClientId !== undefined) {
      ticket['ClientId'] = req.body.ClientId;
    } else {
      clientInfo = _.pick(req.body, ['firstName', 'lastName', 'email', 'phone', 'address', 'ethnicity', 'language', 'gender', 'age']);
      const client = await models.Client.create(clientInfo);
      ticket['ClientId'] = client.id;
    }
    ticketInfo = _.pick(req.body, [
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
    ticket = { ...ticket, ...ticketInfo, UserId: req.body.UserId, LocationId: req.body.LocationId };
    const record = await models.Ticket.create(ticket);
    res.status(StatusCodes.CREATED).json(record);
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
});

export default router;
