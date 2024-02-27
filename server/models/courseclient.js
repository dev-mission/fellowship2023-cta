import Model from 'sequelize';

module.exports = (sequelize, DataTypes) => {
  class CourseClient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CourseClient.init({
    CourseId: DataTypes.INTEGER,
    ClientId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'CourseClient',
  });
  return CourseClient;
};