module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Clients', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      firstName: {
        type: Sequelize.TEXT
      },
      lastName: {
        type: Sequelize.TEXT
      },
      age: {
        type: Sequelize.INTEGER
      },
      phone: {
        type: Sequelize.TEXT
      },
      email: {
        type: Sequelize.TEXT
      },
      ethnicity: {
        type: Sequelize.TEXT
      },
      address: {
        type: Sequelize.TEXT
      },
      gender: {
        type: Sequelize.TEXT
      },
      language: {
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
    await queryInterface.dropTable('Clients');
  }
};
