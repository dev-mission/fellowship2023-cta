import { Model } from 'sequelize';
import { DateTime } from 'luxon';
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
      totalTime: {
        type: DataTypes.VIRTUAL(DataTypes.DECIMAL, ['timeInAt', 'timeOutAt']),
        get() {
          let end = DateTime.fromJSDate(this.timeOutAt);
          let start = DateTime.fromJSDate(this.timeInAt);
          return parseFloat(end.diff(start, 'hours').toObject().hours.toFixed(2));
        },  

      },
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
