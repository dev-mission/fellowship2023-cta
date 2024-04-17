import { Model } from 'sequelize';

export default function (sequelize, DataTypes) {
  class Ticket extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Ticket.belongsTo(models.Appointment);
      Ticket.belongsTo(models.Client);
      Ticket.belongsTo(models.Location);
      Ticket.belongsTo(models.User);
    }
  }
  Ticket.init(
    {
      ticketType: DataTypes.TEXT,
      serialNumber: DataTypes.TEXT,
      device: DataTypes.TEXT,
      problem: DataTypes.TEXT,
      troubleshooting: DataTypes.TEXT,
      resolution: DataTypes.TEXT,
      dateOn: DataTypes.DATE,
      timeInAt: DataTypes.DATE,
      timeOutAt: DataTypes.DATE,
      totalTime: DataTypes.INTEGER,
      hasCharger: DataTypes.BOOLEAN,
      notes: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'Ticket',
    },
  );
  return Ticket;
}
