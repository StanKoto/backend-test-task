'use strict';

const positions = require('../dataGenerators/positionData');

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      await queryInterface.sequelize.transaction(async t => {
        await queryInterface.bulkInsert('Positions', positions, {
          transaction: t
        });
      });
    } catch (err) {
      console.error(err);
    }
  },

  async down (queryInterface, Sequelize) {
    try {
      await queryInterface.sequelize.transaction(async t => {
        await queryInterface.bulkDelete('Positions', null, {
          transaction: t
        });
        
        await queryInterface.sequelize.query('ALTER SEQUENCE "Positions_id_seq" RESTART WITH 1;', {
          transaction: t
        });
      });
    } catch (err) {
      console.error(err);
    }
  }
};
