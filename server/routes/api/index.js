import express from 'express';
import assetsRoutes from './assets.js';
import authRoutes from './auth.js';
import invitesRoutes from './invites.js';
import passwordsRoutes from './passwords.js';
import usersRoutes from './users.js';
import ticketRoutes from './ticket.js';
import interceptors from '../interceptors.js';
import locationsRoutes from './locations.js';
import coursesRoutes from './courses.js';
import clientsRoutes from './clients.js';
import devicesRoutes from './devices.js';
import donorsRoutes from './donors.js';

const router = express.Router();

router.use('/assets', assetsRoutes);
router.use('/auth', authRoutes);
router.use('/invites', invitesRoutes);
router.use('/passwords', passwordsRoutes);
router.use('/users', usersRoutes);
router.use('/ticket', interceptors.requireCTA, ticketRoutes);
//Need to handle interceptor for inventory role
router.use('/devices', devicesRoutes);
//Need to handle interceptor for inventory role
router.use('/donors', donorsRoutes);
router.use('/locations', interceptors.requireAdmin, locationsRoutes);
router.use('/courses', interceptors.requireAdmin, coursesRoutes);
router.use('/clients', interceptors.requireCTA, clientsRoutes);

export default router;
