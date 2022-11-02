'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      await queryInterface.createTable('Users', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false
        },
        phone: {
          type: Sequelize.STRING,
          allowNull: false
        },
        position_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Positions',
            key: 'id'
          },
          onDelete: 'SET NULL',
          onUpdate: 'CASCADE'
        },
        photo: {
          type: Sequelize.STRING,
          allowNull: false
        },
        token_id: {
          type: Sequelize.UUID,
          allowNull: false
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
      await queryInterface.dropTable('Users');
    } catch (err) {
      console.error(err);
    }
  }
};