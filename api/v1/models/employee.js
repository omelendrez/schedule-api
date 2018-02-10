"use strict";
module.exports = function(sequelize, DataTypes) {
  const Employee = sequelize.define("employee", {
    badge: {
      type: DataTypes.STRING,
      allowNull: false
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    branch_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    position_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sector_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    joining_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status_id: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    }
  });

  return Employee;
};