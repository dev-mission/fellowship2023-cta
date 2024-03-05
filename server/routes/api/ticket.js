import express from 'express';
import { StatusCodes } from 'http-status-codes';
import _ from 'lodash';

import models from '../../models/index.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const records = await models.Ticket.findAll();
    res.json(records);
});

router.get('/:id', async (req, res) => {
    try{
        const record = await models.Ticket.findByPk(req.params.id);
        res.json(record);
    }
    catch (err) {
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
});

router.patch('/:id', async (req, res) => {
    try{
        const record = await models.Ticket.findByPk(req.params.id);
        await record.update(_.pick(req.body, [
          "device", "problem", "troubleshooting", "resolution", "dateOn", "timeInAt", "timeOutAt", "totalTime", "hasCharger", "notes",
        ]));
        res.json(record);
      } catch (err){
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
      }
});

router.delete('/:id', async (req, res) => {
    try{
        const record = await models.Ticket.findByPk(req.params.id);
        await record.destroy();
        res.status(StatusCodes.OK).end();
      } catch (err){
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

  user first fetch from the client table to see if the client exist, if not create a new client.

*/
router.post('/', async (req, res) => {

      try{


        const record = await models.Ticket.create(_.pick(req.body, [
          "firstName","lastName","language","device", "problem", "troubleshooting", "resolution", "dateOn", "timeInAt", "timeOutAt", "totalTime", "hasCharger", "notes",
        ]));
        const client = await models.Client.findByPk(req.body.ClientId);
        const location = await models.Location.findByPk(req.body.LocationId);
        const user = await models.User.findByPk(req.body.UserId);
        const device = await models.Device.findByPk(req.body.DeviceId);
        record.setLocation(location);
        record.setUser(user);
        record.setDevice(device);
        record.setClient(client);
        res.status(StatusCodes.CREATED).json(record);
      } catch (err){
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
      }
});

export default router;