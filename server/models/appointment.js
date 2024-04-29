import { Model } from 'sequelize';

export default function (sequelize, DataTypes) {
  class Appointment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Appointment.belongsTo(models.Client);
      Appointment.belongsTo(models.Location);
      Appointment.belongsTo(models.User);
    }
  }
  Appointment.init(
    {
      dateOn: DataTypes.DATEONLY,
      timeInAt: DataTypes.TIME,
      timeOutAt: DataTypes.TIME,
      problem: DataTypes.TEXT,
      status: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'Appointment',
    },
  );
  return Appointment;
}
