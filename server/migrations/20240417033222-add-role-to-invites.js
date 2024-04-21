/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Invites', 'role', {
      type: Sequelize.TEXT,
      allowNull: false,
    });
    await queryInterface.addColumn('Invites', 'LocationId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: {
          tableName: 'Locations',
        },
        key: 'id',
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Invites', 'LocationId');
    await queryInterface.removeColumn('Invites', 'role');
  },
};
