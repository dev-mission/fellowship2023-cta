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
        type: Sequelize.INTEGER,
        reference: {
          model: {
            tableName: 'Appointments'
          },
          key: 'id',
        },
      },
      ClientId: {
        type: Sequelize.INTEGER,
        reference: {
          model: {
            tableName: 'Clients'
          },
          key: 'id'
        },
      },
      LocationId: {
        type: Sequelize.INTEGER,
        reference: {
          model: {
            tableName: 'Location'
          },
          key: 'id',
        }
      },
      UserId: {
        type: Sequelize.INTEGER,
        reference: {
          model: {
            tableName: 'User'
          },
          key: 'id'
        },
      },
      DeviceId: {
        type: Sequelize.INTEGER,
        reference: {
          model: {
            tableName: 'Device'
          },
          key: 'id'
        }
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
      notes: {
        type: Sequelize.TEXT
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