"use strict";
module.exports = function (sequelize, DataTypes) {
  const Availability = sequelize.define(
    "availability",
    {
      employee_id: {
        type: DataTypes.SMALLINT,
        allowNull: false
      },
      week_day: {
        type: DataTypes.TINYINT,
        allowNull: false
      },
      from: {
        type: DataTypes.CHAR(2),
        allowNull: false
      },
      to: {
        type: DataTypes.CHAR(2),
        allowNull: false
      }
    }, {
    timestamps: false
  });

  return Availability;
};
