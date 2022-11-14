
module.exports = (sequelize, DataTypes) => {
    const user = sequelize.define('user', {
      username: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
      },
      password: {
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
        tableName : 'user'
    });

    return user;
}