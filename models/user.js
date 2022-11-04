'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.belongsTo(models.Position, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        as: 'position',
        foreignKey: {
          name: 'position_id',
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            notNull: {
              msg: 'The position id field is required.'
            },
            notEmpty: {
              msg: 'The position id field is required.'
            },
            isInt: {
              msg: 'The position id must be an integer.'
            }
          }
        }
      });
    }
  }
  User.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'The name field is required.'
        },
        notEmpty: {
          msg: 'The name field is required.'
        },
        len: {
          args: [2, 60],
          msg: 'The name must be at least 2 characters long and not longer than 60 characters.'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'The email field is required.'
        },
        notEmpty: {
          msg: 'The email field is required.'
        },
        isEmail: {
          msg: 'The email must be a valid email address.'
        }
      }
    },
    phone: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'The phone field is required.'
        },
        notEmpty: {
          msg: 'The phone field is required.'
        },
        is: {
          args: ['^[\+]{0,1}380([0-9]{9})$'],
          msg: 'The phone must be a valid phone number starting with +380 (Ukraine country code).'
        }
      }
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    token_id: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};