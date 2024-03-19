module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Tickets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      AppointmentId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Appointments',
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
      ticketType:{
        type: Sequelize.TEXT,
      },
      serialNumber: {
        type: Sequelize.INTEGER,
      },
      device: {
        type: Sequelize.TEXT,
      },
      problem: {
        type: Sequelize.TEXT,
      },
      troubleshooting: {
        type: Sequelize.TEXT,
      },
      resolution: {
        type: Sequelize.TEXT,
      },
      dateOn: {
        type: Sequelize.DATE,
      },
      timeInAt: {
        type: Sequelize.DATE,
      },
      timeOutAt: {
        type: Sequelize.DATE,
      },
      totalTime: {
        type: Sequelize.INTEGER,
      },
      hasCharger: {
        type: Sequelize.BOOLEAN,
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
    await queryInterface.addIndex('Tickets', ['AppointmentId'], { unique: true });
    // set starting id to larger value so it doesn't conflict with test fixtures
    await queryInterface.sequelize.query('ALTER SEQUENCE "Tickets_id_seq" RESTART WITH 100;');
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Tickets');
  },
};
