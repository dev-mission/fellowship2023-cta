'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Tickets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      AppointmentId: {
        type: Sequelize.INTEGER
      },
      ClientId: {
        type: Sequelize.INTEGER
      },
      LocationId: {
        type: Sequelize.INTEGER
      },
      UserId: {
        type: Sequelize.INTEGER
      },
      DeviceId: {
        type: Sequelize.INTEGER
      },
      device: {
        type: Sequelize.TEXT
      },
      problem: {
        type: Sequelize.TEXT
      },
      troubleshooting: {
        type: Sequelize.TEXT
      },
      resolution: {
        type: Sequelize.TEXT
      },
      dateOn: {
        type: Sequelize.DATE
      },
      timeInAt: {
        type: Sequelize.DATE
      },
      timeOutAt: {
        type: Sequelize.DATE
      },
      totalTime: {
        type: Sequelize.INTEGER
      },
      hasCharger: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Tickets');
  }
};