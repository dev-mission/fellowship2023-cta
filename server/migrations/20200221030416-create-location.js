module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Locations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.TEXT,
      },
      address1: {
        type: Sequelize.TEXT,
      },
      address2: {
        type: Sequelize.TEXT,
      },
      city: {
        type: Sequelize.TEXT,
      },
      state: {
        type: Sequelize.TEXT,
      },
      zipCode: {
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
    await queryInterface.addIndex('Locations', ['name', 'address1', 'address2'], { unique: true });
    // set starting id to larger value so it doesn't conflict with test fixtures
    await queryInterface.sequelize.query('ALTER SEQUENCE "Locations_id_seq" RESTART WITH 100;');    
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Locations');
  },
};
