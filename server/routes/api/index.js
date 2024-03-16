import express from 'express';
import assetsRoutes from './assets.js';
import authRoutes from './auth.js';
import invitesRoutes from './invites.js';
import passwordsRoutes from './passwords.js';
import usersRoutes from './users.js';
import locationsRoutes from './locations.js';
import coursesRoutes from './courses.js';
import clientsRoutes from './clients.js';

const router = express.Router();

router.use('/assets', assetsRoutes);
router.use('/auth', authRoutes);
router.use('/invites', invitesRoutes);
router.use('/passwords', passwordsRoutes);
router.use('/users', usersRoutes);
router.use('/locations', locationsRoutes);
router.use('/courses', coursesRoutes);
router.use('/clients', clientsRoutes);

export default router;
