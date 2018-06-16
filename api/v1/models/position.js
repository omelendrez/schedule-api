"use strict";
module.exports = function(sequelize, DataTypes) {
  const Position = sequelize.define(
    "position",
    {
      sector_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      color: {
        type: DataTypes.STRING,
        allowNull: false
      },
      text: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      indexes: [
        {
          fields: ["sector_id"]
        }
      ]
    }
  );

  return Position;
};
