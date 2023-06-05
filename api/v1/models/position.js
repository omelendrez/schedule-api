"use strict";
module.exports = function (sequelize, DataTypes) {
  const Position = sequelize.define(
    "position",
    {
      sector_id: {
        type: DataTypes.TINYINT,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING(20),
        allowNull: false
      },
      color: {
        type: DataTypes.STRING(7),
        allowNull: false
      },
      text: {
        type: DataTypes.STRING(7),
        allowNull: false
      }
    }, {
    timestamps: false
  });

  return Position;
};
