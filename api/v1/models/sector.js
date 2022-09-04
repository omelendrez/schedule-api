"use strict";
module.exports = function (sequelize, DataTypes) {
  const Sector = sequelize.define("sector", {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    timestamps: false
  });

  return Sector;
};
