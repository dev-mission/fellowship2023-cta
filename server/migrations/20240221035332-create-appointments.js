module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Appointments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ClientId: {
        type: Sequelize.INTEGER
        references: {
          model: {
            tableName: 'Clients';
          },
          key: 'id';
        },
      },
      LocationId: {
        type: Sequelize.INTEGER
        references: {
          model: {
            tableName: 'Locations';
          },
          key: 'id';
        },
      },
      dateTimeAt: {
        type: Sequelize.DATE
      },
      notes: {
        type: Sequelize.TEXT
      },
      isConfirmed: {
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
    await queryInterface.dropTable('Appointments');
  }
};
