'use strict';

const authService = require('../services/authService')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
     return await queryInterface.bulkInsert('Admins', [{
      name: 'nada',
      email: 'moonup123@gmail.com',
      password: authService.hashPassword('123456789'),
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null
    }]);
  
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
