'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('teacher_training', { 
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      testId: {
        type: Sequelize.STRING,
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
      lastEducation:{
        type: Sequelize.STRING,
        allowNull: false
      },
      university:{
        type: Sequelize.STRING,
        allowNull: false
      },
      major:{
        type: Sequelize.STRING,
        allowNull: false
      },
      ipk:{
        type: Sequelize.STRING,
        allowNull: false
      },
      englishProficiency:{
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
      teachingTime:{
        type: Sequelize.STRING,
        allowNull: false
      },
      teachingLocation:{
        type: Sequelize.STRING,
        allowNull: false
      },
      teachingProvince:{
        type: Sequelize.STRING,
        allowNull: false
      },
      teachingCity:{
        type: Sequelize.STRING,
        allowNull: false
      },
      teachingSubject:{
        type: Sequelize.STRING,
        allowNull: false
      },
      testLocation:{
        type: Sequelize.STRING,
        allowNull: false
      },
      infoFrom:{
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
    await queryInterface.dropTable('teacher_training');
  }
};
