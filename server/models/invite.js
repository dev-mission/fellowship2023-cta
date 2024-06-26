import { Model } from 'sequelize';
import _ from 'lodash';
import mailer from '../emails/mailer.js';

export default function (sequelize, DataTypes) {
  class Invite extends Model {
    static associate(models) {
      Invite.belongsTo(models.Location);
      Invite.belongsTo(models.User, { as: 'AcceptedByUser' });
      Invite.belongsTo(models.User, { as: 'RevokedByUser' });
      Invite.belongsTo(models.User, { as: 'CreatedByUser' });
    }

    toJSON() {
      const json = _.pick(this.get(), [
        'id',
        'LocationId',
        'firstName',
        'lastName',
        'email',
        'message',
        'role',
        'LocationId',
        'createdAt',
        'CreatedByUserId',
        'acceptedAt',
        'AcceptedByUserId',
        'revokedAt',
        'RevokedByUserId',
        'updatedAt',
      ]);
      if (this.Location) {
        json.Location = this.Location.toJSON();
      }
      return json;
    }

    sendInviteEmail() {
      return mailer.send({
        template: 'invite',
        message: {
          to: this.fullNameAndEmail,
        },
        locals: {
          firstName: this.firstName,
          url: `${process.env.BASE_URL}/invites/${this.id}`,
          message: this.message,
        },
      });
    }
  }

  Invite.init(
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'First name cannot be blank',
          },
          notEmpty: {
            msg: 'First name cannot be blank',
          },
        },
      },
      lastName: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.CITEXT,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Email cannot be blank',
          },
          notEmpty: {
            msg: 'Email cannot be blank',
          },
        },
      },
      fullName: {
        type: DataTypes.VIRTUAL,
        get() {
          return `${this.firstName} ${this.lastName}`.trim();
        },
      },
      fullNameAndEmail: {
        type: DataTypes.VIRTUAL,
        get() {
          return `${this.fullName} <${this.email}>`;
        },
      },
      message: DataTypes.TEXT,
      role: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      acceptedAt: DataTypes.DATE,
      revokedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'Invite',
    },
  );
  return Invite;
}
