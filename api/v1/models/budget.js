"use strict";
module.exports = function (sequelize, DataTypes) {
  const Budget = sequelize.define(
    "budget",
    {
      branch_id: {
        type: DataTypes.TINYINT,
        allowNull: false
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      hours: {
        type: DataTypes.SMALLINT,
        defaultValue: 0
      },
      program: {
        type: DataTypes.SMALLINT,
        defaultValue: 0
      },
      footer: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {
    timestamps: false
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
