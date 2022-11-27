'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Customer.hasMany(models.Appointment, {
        foreignKey: 'customerId'
      })
      Customer.hasMany(models.Address, {
        foreignKey: 'customerId'
      })
      Customer.hasMany(models.Review, {
        foreignKey: 'customerId'
      })
    }
  }
  Customer.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    image: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Customer',
    paranoid: true
  });
  return Customer;
};