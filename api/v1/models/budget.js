"use strict";
module.exports = function (sequelize, DataTypes) {
  const Budget = sequelize.define("budget", {
    branch_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    hours: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    footer: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, 
    {
      indexes: [{
        unique: true,
        fields: ["date", "branch_id"]
      }]
    });

  return Budget;
};