const { DataTypes } = require("sequelize");
const { sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
    const japaneseStudies = sequelize.define('japaneseStudies', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
          },
          name:{
            type: DataTypes.STRING,
            allowNull: false
          },
          gender:{
            type: DataTypes.STRING,
            allowNull: false
          },
          birthdate:{
            type: DataTypes.DATE,
            allowNull: false
          },
          japaneseResident:{
            type: DataTypes.STRING,
            allowNull: false
          },
          province:{
            type: DataTypes.STRING,
            allowNull: false
          },
          city:{
            type: DataTypes.STRING,
            allowNull: false
          },
          address:{
            type: DataTypes.STRING,
            allowNull: false
          },
          telephone:{
            type: DataTypes.STRING,
            allowNull: false
          },
          handphone:{
            type: DataTypes.STRING,
            allowNull: false
          },
          email:{
            type: DataTypes.STRING,
            allowNull: false
          },
          university:{
            type: DataTypes.STRING,
            allowNull: false
          },
          semester:{
            type: DataTypes.STRING,
            allowNull: false
          },
          ipk:{
            type: DataTypes.STRING,
            allowNull: false
          },
          jlpt:{
            type: DataTypes.STRING,
            allowNull: false
          },
          jlptScore:{
            type: DataTypes.STRING,
            allowNull: false
          },
          testLocation:{
            type: DataTypes.STRING,
            allowNull: false
          },
          createdAt:{
            type: DataTypes.DATE,
            allowNull: false
          },
          updatedAt:{
            type: DataTypes.DATE,
            allowNull: false
          }
    }, {
        tableName : 'japanese_studies'
    });

    return japaneseStudies;
}