import express from 'express';
import { StatusCodes } from 'http-status-codes';
import _ from 'lodash';

import models from '../../models/index.js';
import helpers from '../helpers.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const page = req.query.page || '1';
  const { records, pages, total } = await models.Appointment.paginate({
    page,
    include: [
      {
        model: models.Client,
        attributes: ['phone', 'email', 'language', 'fullName'],
        include: {
          model: models.Device,
          attributes: ['model'],
        },
      },
      {
        model: models.User,
        attributes: ['fullName'],
      },
      { model: models.Location, attributes: ['name'] },
    ],
  });
  helpers.setPaginationHeaders(req, res, page, pages, total);
  res.json(records.map((r) => r.toJSON()));
});

router.get('/:id', async (req, res) => {
  try {
    const record = await models.Appointment.findByPk(req.params.id);
    res.json(record);
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const record = await models.Appointment.findByPk(req.params.id, {
      include: [
        {
          model: models.Client,
          attributes: ['fullName', 'phone', 'email'],
          include: {
            model: models.Device,
            attributes: ['model'],
          },
        },
        {
          model: models.User,
          attributes: ['fullName'],
        },
        { model: models.Location, attributes: ['name'] },
      ],
    });

    await record.update(
      _.pick(req.body, ['ClientId', 'UserId', 'LocationId', 'state', 'dateOn', 'timeInAt', 'timeOutAt', 'problem', 'status']),
    );
    await record.save();
    const ticket = await models.Ticket.findOne({ where: { AppointmentId: record.id } });
    ticket.update(_.pick(req.body, ['UserId', 'LocationId', 'ClientId', 'dateOn', 'problem', 'timeInAt', 'timeOutAt']));
    ticket.save();
    res.json(record);
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const record = await models.Appointment.findByPk(req.params.id);
    const ticket = await models.Ticket.findOne({ where: { AppointmentId: record.id } });
    if (ticket) {
      await ticket.update({ AppointmentId: null });
      await ticket.save();
    }
    await record.destroy();
    res.status(StatusCodes.OK).send({ message: 'Appointment deleted' });
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
});

router.post('/', async (req, res) => {
  try {
    const appointment = await models.Appointment.create(
      _.pick(req.body, ['ClientId', 'UserId', 'LocationId', 'state', 'dateOn', 'timeInAt', 'timeOutAt', 'problem', 'status']),
    );
    const ticket = await models.Ticket.create(
      _.pick(req.body, ['UserId', 'LocationId', 'ClientId', 'dateOn', 'problem', 'timeInAt', 'timeOutAt']),
    );
    //Ticket creation will need us to updateTime.
    const user = await models.User.findByPk(req.user.id);
    const newTime = parseFloat(user.totalTime) + ticket.totalTime;
    ticket.set({
      AppointmentId: appointment.id,
      ticketType: 'Appointment',
    });
    user.update({ totalTime: newTime });
    user.save();
    ticket.save();
    const currentAppointment = await models.Appointment.findByPk(appointment.id, {
      include: [
        {
          model: models.Client,
          attributes: ['fullName', 'phone', 'email'],
          include: {
            model: models.Device,
            attributes: ['model'],
          },
        },
        {
          model: models.User,
          attributes: ['fullName'],
        },
        { model: models.Location, attributes: ['name'] },
      ],
    });
    res.status(StatusCodes.CREATED).json(currentAppointment);
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
});

/*
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


*/

router.post('/', async (req, res) => {
  try {
    const appointment = await models.Appointment.create(
      _.pick(req.body, ['ClientId', 'UserId', 'LocationId', 'state', 'dateOn', 'startTime', 'endTime', 'problem', 'status']),
    );
    const ticket = await models.Ticket.create(_.pick(req.body, ['UserId', 'LocationId', 'ClientId', 'dateOn', 'problem']));
    ticket.set({
      AppointmentId: appointment.id,
      ticketType: 'Appointment',
      timeInAt: appointment.startTime,
      timeOutAt: appointment.endTime,
    });
    ticket.save();
    res.status(StatusCodes.CREATED).json(appointment);
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
  }
});

export default router;
