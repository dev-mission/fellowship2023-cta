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
      Client.hasMany(models.Ticket);
      Client.hasOne(models.Device);
      Client.hasMany(models.Appointment);
      Client.hasMany(models.CourseClient);
      Client.belongsToMany(models.Course, { through: models.CourseClient });
    }
  }
  Client.init(
    {
      firstName: DataTypes.TEXT,
      lastName: DataTypes.TEXT,
      age: DataTypes.INTEGER,
      phone: {
        type: DataTypes.STRING,
        validate: {
          isStrong(value) {
            if (value.match(/^\d{3}-\d{3}-\d{4}$/) == null) {
              throw new Error('Invalid phone number. Use format 123-456-7890.');
            }
          },
        },
      },
      email: DataTypes.TEXT,
      ethnicity: DataTypes.TEXT,
      address: DataTypes.TEXT,
      gender: DataTypes.TEXT,
      language: DataTypes.TEXT,
      fullName: {
        type: DataTypes.VIRTUAL(DataTypes.TEXT, ['firstName', 'lastName']),
        get() {
          return `${this.firstName} ${this.lastName}`;
        },
      },
    },
    {
      sequelize,
      modelName: 'Client',
    },
  );
  return Client;
}
