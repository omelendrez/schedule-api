"use strict";
module.exports = function (sequelize, DataTypes) {
  const Status = sequelize.define("status", {
    name: {
      type: DataTypes.STRING(20),
      allowNull: false
    }
  }, {
    timestamps: false
  });

  return Status;
};
