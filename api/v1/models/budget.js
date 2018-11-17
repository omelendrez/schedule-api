"use strict";
module.exports = function(sequelize, DataTypes) {
  const Budget = sequelize.define(
    "budget",
    {
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
      program: {
        type: DataTypes.INTEGER,
        defaultValue: 0
      },
      footer: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      indexes: [
        {
          unique: true,
          fields: ["date", "branch_id"]
        }
      ]
    }
  );

  return Budget;
};
