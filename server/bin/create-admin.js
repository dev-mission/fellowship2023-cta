#!/usr/bin/env node

'use strict';

if (process.argv.length != 6) {
  console.log('Usage: bin/create-admin.js First Last email@address.com password');
  process.exit(1);
}

import bcrypt from 'bcrypt';
import models from '../models/index.js';

bcrypt.hash(process.argv[5], 10).then(async (hashedPassword) => {
  const response = await models.Location.findByPk(1);

  if (response === null) {
    models.Location.create({
      id: 1,
      name: 'Dev/Mission',
      address1: '356 Bryant St',
      address2: 'N/A',
      city: 'San Francisco',
      state: 'California',
      zipCode: '94107',
    });
  }

  models.User.create({
    firstName: process.argv[2],
    lastName: process.argv[3],
    email: process.argv[4],
    LocationId: 1,
    hashedPassword: hashedPassword,
    isAdmin: true,
  }).then(() => {
    console.log('Admin user created!');
    models.sequelize.close();
  });
});
