'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Donor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Donor.init({
    name: DataTypes.TEXT,
    phone: DataTypes.TEXT,
    email: DataTypes.TEXT,
    address1: DataTypes.TEXT,
    address2: DataTypes.TEXT,
    city: DataTypes.TEXT,
    state: DataTypes.TEXT,
    zip: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Donor',
  });
  return Donor;
};