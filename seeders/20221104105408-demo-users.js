'use strict';

const users = require('../dataGenerators/userData');

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      await queryInterface.sequelize.transaction(async t => {
        await queryInterface.bulkInsert('Users', users, {
          transaction: t
        });
      })
    } catch (err) {
      console.error(err);
    }
  },

  async down (queryInterface, Sequelize) {
    try {
      await queryInterface.sequelize.transaction(async t => {
        await queryInterface.bulkDelete('Users', null, {
          transaction: t
        });
        
        await queryInterface.sequelize.query('ALTER SEQUENCE "Users_id_seq" RESTART WITH 1;', {
          transaction: t
        });
      });
    } catch (err) {
      console.error(err);
    }
  }
};
