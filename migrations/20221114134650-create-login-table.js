'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('user', { 
      username: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt:{
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt:{
        type: Sequelize.DATE,
        allowNull: false
      }
      });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('user');
  }
};
