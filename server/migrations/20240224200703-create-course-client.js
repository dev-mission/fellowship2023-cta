module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CourseClients', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      CourseId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Courses',
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
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
    await queryInterface.createIndex('CourseClients', ['CourseId', 'ClientId'], { unique: true });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('CourseClients');
  },
};
