'use strict';

const { faker } = require('@faker-js/faker');

const users = [];

for (let i = 0; i < 45; i++) {
  const name = faker.name.fullName();
  const email = faker.helpers.unique(faker.internet.email, [ name ]);
  const phone = faker.helpers.unique(faker.phone.number, [ '+380#########' ]);
  const position_id = faker.datatype.number({ min: 1, max: 10 });
  const photo = faker.helpers.unique(faker.image.image, [ 70, 70, true ]);
  const token_id = faker.helpers.unique(faker.datatype.string, [ 21 ]);
  const createdAt = new Date();
  const updatedAt = new Date();

  users.push({ name, email, phone, position_id, photo, token_id, createdAt, updatedAt });
}

module.exports = users;