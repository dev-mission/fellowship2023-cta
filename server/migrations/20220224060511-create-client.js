module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Clients', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      firstName: {
        type: Sequelize.TEXT,
      },
      lastName: {
        type: Sequelize.TEXT,
      },
      age: {
        type: Sequelize.INTEGER,
      },
      phone: {
        type: Sequelize.TEXT,
      },
      email: {
        type: Sequelize.TEXT,
      },
      ethnicity: {
        type: Sequelize.TEXT,
      },
      address: {
        type: Sequelize.TEXT,
      },
      gender: {
        type: Sequelize.TEXT,
      },
      language: {
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
    await queryInterface.addIndex('Clients', ['firstName', 'lastName', 'phone', 'email'], { unique: true });
        // set starting id to larger value so it doesn't conflict with test fixtures
        await queryInterface.sequelize.query('ALTER SEQUENCE "Clients_id_seq" RESTART WITH 100;');
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Clients');
  },
};
