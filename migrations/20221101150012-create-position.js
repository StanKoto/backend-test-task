'use strict';
module.exports = {

  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.createTable('Positions', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      });
    } catch (err) {
      console.error(err);
    }
  },
  async down(queryInterface, Sequelize) {
    try {
      await queryInterface.dropTable('Positions');
    } catch (err) {
      console.error(err);
    }
  }
};