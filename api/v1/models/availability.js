"use strict";
module.exports = function(sequelize, DataTypes) {
  const Availability = sequelize.define("availability", {
    employee_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    mo: {
      type: DataTypes.CHAR(11),
      allowNull: false
    },
    tu: {
      type: DataTypes.CHAR(11),
      allowNull: false
    },
    we: {
      type: DataTypes.CHAR(11),
      allowNull: false
    },
    th: {
      type: DataTypes.CHAR(11),
      allowNull: false
    },
    fr: {
      type: DataTypes.CHAR(11),
      allowNull: false
    },
    sa: {
      type: DataTypes.CHAR(11),
      allowNull: false
    },
    su: {
      type: DataTypes.CHAR(11),
      allowNull: false
    }
  });

  return Availability;
};