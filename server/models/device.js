import { Model } from 'sequelize';
export default function (sequelize, DataTypes) {
  class Device extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Device.init(
    {
      DonorId: DataTypes.INTEGER,
      LocationId: DataTypes.INTEGER,
      UserId: DataTypes.INTEGER,
      ClientId: DataTypes.INTEGER,
      deviceType: DataTypes.TEXT,
      model: DataTypes.TEXT,
      brand: DataTypes.TEXT,
      serialNum: DataTypes.TEXT,
      cpu: DataTypes.TEXT,
      ram: DataTypes.TEXT,
      os: DataTypes.TEXT,
      username: DataTypes.TEXT,
      password: DataTypes.TEXT,
      condition: DataTypes.TEXT,
      value: DataTypes.DECIMAL,
      notes: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'Device',
    },
  );
  return Device;
}
