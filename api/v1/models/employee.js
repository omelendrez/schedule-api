"use strict";
module.exports = function (sequelize, DataTypes) {
  const Employee = sequelize.define("employee", {
    badge: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    first_name: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    branch_id: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    joining_date: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    status_id: {
      type: DataTypes.TINYINT,
      defaultValue: 1
    }
  }, {
    timestamps: false
  });

  return Employee;
};
