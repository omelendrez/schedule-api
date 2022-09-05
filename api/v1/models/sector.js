"use strict";
module.exports = function (sequelize, DataTypes) {
  const Sector = sequelize.define("sector", {
    name: {
      type: DataTypes.STRING(20),
      allowNull: false
    }
  }, {
    timestamps: false
  });

  return Sector;
};
