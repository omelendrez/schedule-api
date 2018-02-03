"use strict";
module.exports = function(sequelize, DataTypes) {
  const Budget = sequelize.define("budget", {
    branch_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    hours: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    indexes: [{
      unique: true,
      fields: ["date"]
    }]
  });

  return Budget;
};