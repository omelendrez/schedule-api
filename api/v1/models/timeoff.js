"use strict";
module.exports = function (sequelize, DataTypes) {
  const Timeoff = sequelize.define(
    "timeoff",
    {
      employee_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      absenteeism_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      }
    },
    {
      indexes: [
        {
          fields: ["employee_id", "date"],
          unique: true
        }
      ]
    }
  );

  return Timeoff;
};
