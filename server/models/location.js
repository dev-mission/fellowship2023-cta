import { Model } from 'sequelize';

export default function (sequelize, DataTypes) {
  class Location extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Location.hasMany(models.Appointment);
      Location.hasMany(models.Ticket);
      Location.hasMany(models.Device);
      Location.belongsTo(models.User);
    }
  }
  Location.init(
    {
      name: DataTypes.TEXT,
      address1: DataTypes.TEXT,
      address2: DataTypes.TEXT,
      city: DataTypes.TEXT,
      state: DataTypes.TEXT,
      zipCode: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'Location',
    },
  );
  return Location;
}
