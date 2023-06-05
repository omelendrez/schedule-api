"use strict";
module.exports = function (sequelize, DataTypes) {
  const Branch = sequelize.define("branch", {
    name: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    status_id: {
      type: DataTypes.TINYINT,
      defaultValue: 1
    }
  }, {
    timestamps: false
  });

  return Branch;
};
