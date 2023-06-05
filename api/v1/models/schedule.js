"use strict";
module.exports = function (sequelize, DataTypes) {
  const Schedule = sequelize.define(
    "schedule",
    {
      budget_id: {
        type: DataTypes.SMALLINT,
        allowNull: false
      },
      employee_id: {
        type: DataTypes.SMALLINT,
        allowNull: false
      },
      position_id: {
        type: DataTypes.TINYINT,
        allowNull: false
      },
      from: {
        type: DataTypes.TINYINT,
        allowNull: false
      },
      to: {
        type: DataTypes.TINYINT,
        allowNull: false
      },
      total: {
        type: DataTypes.TINYINT,
        defaultValue: 0
      }
    }, {
    timestamps: false
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
