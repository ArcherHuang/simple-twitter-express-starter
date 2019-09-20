'use strict'
const bcrypt = require('bcrypt-nodejs')
const faker = require('faker')

module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.bulkInsert(
      'Users',
      [
        {
          email: 'root@example.com',
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          role: 'admin',
          name: 'root',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          email: 'user1@example.com',
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          role: 'user',
          name: 'user1',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          email: 'user2@example.com',
          password: bcrypt.hashSync('12345678', bcrypt.genSaltSync(10), null),
          role: 'user',
          name: 'user2',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    )

    queryInterface.bulkInsert(
      'Tweets',
      Array.from({ length: 50 }).map((d) => ({
        description: faker.lorem.text(),
        UserId: faker.random.number({
          min: 1,
          max: 3
        }),
        createdAt: new Date(),
        updatedAt: new Date()
      })),
      {}
    )

    return queryInterface.bulkInsert(
      'Replies',
      Array.from({ length: 20 }).map((d) => ({
        comment: faker.lorem.text(),
        UserId: faker.random.number({
          min: 1,
          max: 3
        }),
        TweetId: faker.random.number({
          min: 1,
          max: 50
        }),
        createdAt: new Date(),
        updatedAt: new Date()
      })),
      {}
    )

  },

  down: (queryInterface, Sequelize) => {
    queryInterface.bulkDelete('Users', null, {})
    queryInterface.bulkDelete('Tweets', null, {})
    return queryInterface.bulkDelete('Replies', null, {})
  }
}
