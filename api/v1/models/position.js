"use strict";
module.exports = function(sequelize, DataTypes) {
  const Position = sequelize.define("position", {
    sector_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  return Position;
};