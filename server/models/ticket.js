'use strict';
import {Model} from "sequelize";
module.exports = (sequelize, DataTypes) => {
  class Ticket extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Ticket.init({
    AppointmentId: DataTypes.INTEGER,
    ClientId: DataTypes.INTEGER,
    LocationId: DataTypes.INTEGER,
    UserId: DataTypes.INTEGER,
    DeviceId: DataTypes.INTEGER,
    device: DataTypes.TEXT,
    problem: DataTypes.TEXT,
    troubleshooting: DataTypes.TEXT,
    resolution: DataTypes.TEXT,
    dateOn: DataTypes.DATE,
    timeInAt: DataTypes.DATE,
    timeOutAt: DataTypes.DATE,
    totalTime: DataTypes.INTEGER,
    hasCharger: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Ticket',
  });
  return Ticket;
};