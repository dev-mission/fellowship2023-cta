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

router.post('/', async (req, res) => {

      try{
        // const record = await models.Ticket.create(_.pick(req.body, [
        //   "Name", "Location", "Rating", "Comment", "Map", "Photo",
        // ]));
        res.status(StatusCodes.CREATED).json(record);
      } catch (err){
        console.log(err);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
      }
});

export default router;