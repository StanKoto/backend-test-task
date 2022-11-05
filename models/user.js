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
            isInt: {
              msg: 'The position id must be an integer.'
            },
            notEmpty: {
              msg: 'The position id field is required.'
            },
            notNull: {
              msg: 'The position id field is required.'
            },
            async checkReferredPosition(value) {
              if (value.trim().length !== 0 && Number.isInteger(Number(value))) {
                const referredPosition = await models.Position.findByPk(Number(value));
                if (!referredPosition) throw new Error('The referred position must be present in the current position list!')
              }
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
        len: {
          args: [2, 60],
          msg: 'The name must be at least 2 characters long and not longer than 60 characters.'
        },
        notEmpty: {
          msg: 'The name field is required.'
        },
        notNull: {
          msg: 'The name field is required.'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: {
          msg: 'The email must be a valid email address.'
        },
        notEmpty: {
          msg: 'The email field is required.'
        },
        notNull: {
          msg: 'The email field is required.'
        }
      }
    },
    phone: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        is: {
          args: ['^[\+]{0,1}380([0-9]{9})$'],
          msg: 'The phone must be a valid phone number starting with +380 (Ukraine country code).'
        },
        notEmpty: {
          msg: 'The phone field is required.'
        },
        notNull: {
          msg: 'The phone field is required.'
        }
      }
    },
    photo: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'A user photo is required.'
        },
        notNull: {
          msg: 'A user photo is required.'
        }
      }
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