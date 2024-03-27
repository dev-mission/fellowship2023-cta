#!/usr/bin/env node

'use strict';
import models from '../models/index.js';
import fixtures from 'sequelize-fixtures';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
console.log(__dirname);

async function loadFixtures(files) {
  const filePaths = files.map((f) => path.resolve(__dirname, `../test/fixtures/${f}.json`));
  await models.sequelize.transaction(async (transaction) => {
    await fixtures.loadFiles(filePaths, models, { transaction });
  });
}

const getTickets = async () => {
  const result = await models.Ticket.findAll();
  return result;
};

const tickets = await getTickets();
if (tickets.length == 0) {
  await loadFixtures(['locations', 'users', 'donors', 'clients', 'devices', 'appointments', 'tickets']);
} else {
  console.log('Test Tickets have been made!');
}
