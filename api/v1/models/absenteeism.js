"use strict";
module.exports = function (sequelize, DataTypes) {
  const Absenteeism = sequelize.define("absenteeism", {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status_id: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    }
  }, {
    timestamps: false
  });

  return Absenteeism;
};
