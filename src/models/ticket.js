'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Ticket extends Model {
    static associate(models) {
      // Define associations here
    }
  }
  Ticket.init({
    subject: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT, //  TEXT allows for long HTML/itinerary content
      allowNull: false
    },
    recipientEmail: { 
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true
      }
    },
    status: {
      type: DataTypes.ENUM,
      allowNull: false,
      values: ["PENDING", "SUCCESS", "FAILED"],
      defaultValue: "PENDING"
    },
    notificationTime: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Ticket', 
  });
  return Ticket;
};