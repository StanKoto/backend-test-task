'use strict';

const envVars = require ('../envVariables.js');

module.exports = {
  development: {
    url: envVars.db.devUri
  },
  production: {
    url: envVars.db.prodUri,
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false
      }
    }
  }
};