import { Model } from 'sequelize';
export default function (sequelize) {
  class CourseClient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      CourseClient.belongsTo(models.Course);
      CourseClient.belongsTo(models.Client);
    }
  }
  CourseClient.init(
    {},
    {
      sequelize,
      modelName: 'CourseClient',
    },
  );
  return CourseClient;
}
