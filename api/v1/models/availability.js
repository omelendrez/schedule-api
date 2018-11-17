"use strict";
module.exports = function(sequelize, DataTypes) {
  const Availability = sequelize.define(
    "availability",
    {
      employee_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      week_day: {
        type: DataTypes.INTEGER,
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
    },
    {
      indexes: [
        {
          fields: ["employee_id"]
        }
      ]
    }
  );

  return Availability;
};
