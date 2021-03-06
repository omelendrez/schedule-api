"use strict";
module.exports = function(sequelize, DataTypes) {
  const Schedule = sequelize.define(
    "schedule",
    {
      budget_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      employee_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      position_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      from: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      to: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      total: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      }
    },
    {
      indexes: [
        {
          fields: ["budget_id"]
        }
      ]
    }
  );

  return Schedule;
};
