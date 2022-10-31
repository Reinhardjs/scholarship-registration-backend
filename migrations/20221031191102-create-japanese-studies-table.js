'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('japanese_studies', { 
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
      },
      name:{
        type: Sequelize.STRING,
        allowNull: false
      },
      gender:{
        type: Sequelize.STRING,
        allowNull: false
      },
      birthdate:{
        type: Sequelize.DATE,
        allowNull: false
      },
      japaneseResident:{
        type: Sequelize.STRING,
        allowNull: false
      },
      province:{
        type: Sequelize.STRING,
        allowNull: false
      },
      city:{
        type: Sequelize.STRING,
        allowNull: false
      },
      address:{
        type: Sequelize.STRING,
        allowNull: false
      },
      telephone:{
        type: Sequelize.STRING,
        allowNull: false
      },
      handphone:{
        type: Sequelize.STRING,
        allowNull: false
      },
      email:{
        type: Sequelize.STRING,
        allowNull: false
      },
      university:{
        type: Sequelize.STRING,
        allowNull: false
      },
      semester:{
        type: Sequelize.STRING,
        allowNull: false
      },
      ipk:{
        type: Sequelize.STRING,
        allowNull: false
      },
      jlpt:{
        type: Sequelize.STRING,
        allowNull: false
      },
      jlptScore:{
        type: Sequelize.STRING,
        allowNull: false
      },
      testLocation:{
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
    await queryInterface.dropTable('japanese_studies');
  }
};
