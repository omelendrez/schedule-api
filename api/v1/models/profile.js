"use strict";
module.exports = function (sequelize, DataTypes) {
  const Profile = sequelize.define("profile", {
    name: {
      type: DataTypes.STRING(20),
      allowNull: false
    }
  }, {
    timestamps: false
  });

  return Profile;
};
