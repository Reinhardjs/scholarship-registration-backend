const { DataTypes } = require("sequelize");
const { sequelize } = require(".");

module.exports = (sequelize, DataTypes) => {
    const registrant = sequelize.define('registrant', {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
          },
          name:{
            type: DataTypes.STRING,
            allowNull: false
          },
          address:{
            type: DataTypes.STRING,
            allowNull: false
          },
          telephone:{
            type: DataTypes.INTEGER,
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
        tableName : 'registrant'
    });

    return registrant;
}