"use strict";
module.exports = function(sequelize, DataTypes) {
  const Profile = sequelize.define("profile", {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  return Profile;
};