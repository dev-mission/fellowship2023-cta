'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Devices', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      DonorId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Donors',
          },
          key: 'id',
        },
      },
      LocationId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Locations',
          },
          key: 'id',
        },
      },
      UserId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Users',
          },
          key: 'id',
        },
      },
      ClientId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Clients',
          },
          key: 'id',
        },
      },
      deviceType: {
        type: Sequelize.TEXT,
      },
      model: {
        type: Sequelize.TEXT,
      },
      brand: {
        type: Sequelize.TEXT,
      },
      serialNum: {
        type: Sequelize.TEXT,
      },
      cpu: {
        type: Sequelize.TEXT,
      },
      ram: {
        type: Sequelize.TEXT,
      },
      os: {
        type: Sequelize.TEXT,
      },
      username: {
        type: Sequelize.TEXT,
      },
      password: {
        type: Sequelize.TEXT,
      },
      condition: {
        type: Sequelize.TEXT,
      },
      value: {
        type: Sequelize.DECIMAL,
      },
      notes: {
        type: Sequelize.TEXT,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
    await queryInterface.addIndex('Devices', ['serialNum'], { unique: true });
        // set starting id to larger value so it doesn't conflict with test fixtures
        await queryInterface.sequelize.query('ALTER SEQUENCE "Users_id_seq" RESTART WITH 100;');
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Devices');
  },
};
