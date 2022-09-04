"use strict";
module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define(
    "user",
    {
      user_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [1, 50]
        }
      },
      password: {
        type: DataTypes.STRING,
        defaultValue: "123"
      },
      full_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      profile_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      branch_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      status_id: {
        type: DataTypes.INTEGER,
        defaultValue: 1
      }
    }, {
    timestamps: false
  });

  User.prototype.toWeb = function (pw) {
    const json = this.toJSON()
    const removeFields = {
      password: undefined,
      created_at: undefined,
      updated_at: undefined
    }
    return { ...json, ...removeFields }
  }

  return User;
};

