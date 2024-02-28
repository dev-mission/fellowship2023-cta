import { Model } from 'sequelize';

export default function(sequelize, DataTypes) {
  class Appointments extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Appointments.init({
    ClientId: DataTypes.INTEGER,
    LocationId: DataTypes.INTEGER,
    dateTimeAt: DataTypes.DATE,
    notes: DataTypes.TEXT,
    isConfirmed: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Appointments',
  });
  return Appointments;
};
