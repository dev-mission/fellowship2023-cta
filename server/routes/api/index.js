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

const router = express.Router();

router.use('/assets', assetsRoutes);
router.use('/auth', authRoutes);
router.use('/invites', invitesRoutes);
router.use('/passwords', passwordsRoutes);
router.use('/users', usersRoutes);
router.use('/ticket', interceptors.requireCTA, ticketRoutes);
router.use('/locations', interceptors.requireAdmin, locationsRoutes);
router.use('/courses', interceptors.requireAdmin, coursesRoutes);
router.use('/clients', interceptors.requireCTA, clientsRoutes);
export default router;
