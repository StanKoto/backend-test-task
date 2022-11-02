'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Position extends Model {
    static associate(models) {
      this.hasMany(models.User, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
        foreignKey: {
          name: 'position_id',
          type: DataTypes.INTEGER,
          allowNull: false,
          validate: {
            notNull: {
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
  Position.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name: { 
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    sequelize,
    modelName: 'Position',
  });
  return Position;
};