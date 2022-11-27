'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Appointments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      serviceId: {
        type: Sequelize.INTEGER
      },
      workerId: {
        type: Sequelize.INTEGER
      },
      customerId: {
        type: Sequelize.INTEGER
      },
      datetime: {
        type: Sequelize.DATE
      },
      isHome: {
        type: Sequelize.BOOLEAN
      },
      addressId: {
        type: Sequelize.INTEGER
      },
      note: {
        type: Sequelize.STRING
      },
      total: {
        type: Sequelize.INTEGER
      },
      canceledAt: {
        type: Sequelize.DATE
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
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Appointments');
  }
};