"use strict";
module.exports = function (sequelize, DataTypes) {
  const Branch = sequelize.define("employee_position", {
    employee_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sector_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    position_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    active: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
  },
    {
      indexes: [{
        fields: ["employee_id"]
      }]
    });

  return Branch;
};