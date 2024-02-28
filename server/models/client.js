import { Model } from 'sequelize';

export default function (sequelize, DataTypes) {
  class Client extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Client.init(
    {
      firstName: DataTypes.TEXT,
      lastName: DataTypes.TEXT,
      age: DataTypes.INTEGER,
      phone: DataTypes.TEXT,
      email: DataTypes.TEXT,
      ethnicity: DataTypes.TEXT,
      address: DataTypes.TEXT,
      gender: DataTypes.TEXT,
      language: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'Client',
    },
  );
  return Client;
}
