"use strict";
module.exports = function (sequelize, DataTypes) {
  const Branch = sequelize.define(
    "employee_position",
    {
      employee_id: {
        type: DataTypes.SMALLINT,
        allowNull: false
      },
      position_id: {
        type: DataTypes.TINYINT,
        allowNull: false
      }
    }, {
    timestamps: false
  },
    {
      indexes: [
        {
          fields: ["employee_id"]
        }
      ]
    }
  );

  return Branch;
};
