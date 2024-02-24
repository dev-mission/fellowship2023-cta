module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CourseClients', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      CourseId: {
        type: Sequelize.TEXT,
        references: {
          model: {
            tableName: 'Courses',
          },
          key: 'id',
        },
      }, 
      ClientId: {
        type: Sequelize.TEXT,
        references: {
          model: {
            tableName: 'Clients',
          },
          key: 'id',
        },
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
    await queryInterface.dropTable('CourseClients');
  }
};