'use strict';

const { faker } = require('@faker-js/faker');

const positions = [];

for (let i = 0; i < 10; i++) {
  const name = faker.helpers.unique(faker.name.jobType);
  const createdAt = new Date();
  const updatedAt = new Date();

  positions.push({ name, createdAt, updatedAt });
}

module.exports = positions;