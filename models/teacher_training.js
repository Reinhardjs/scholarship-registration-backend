
module.exports = (sequelize, DataTypes) => {
    const teacherTraining = sequelize.define('teacherTraining', {
          id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
          },
          testId: {
            type: DataTypes.STRING,
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
          lastEducation:{
            type: DataTypes.STRING,
            allowNull: false
          },
          university:{
            type: DataTypes.STRING,
            allowNull: false
          },
          major:{
            type: DataTypes.STRING,
            allowNull: false
          },
          ipk:{
            type: DataTypes.STRING,
            allowNull: false
          },
          englishProficiency:{
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
          teachingTime:{
            type: DataTypes.STRING,
            allowNull: false
          },
          teachingLocation:{
            type: DataTypes.STRING,
            allowNull: false
          },
          teachingProvince:{
            type: DataTypes.STRING,
            allowNull: false
          },
          teachingCity:{
            type: DataTypes.STRING,
            allowNull: false
          },
          teachingSubject:{
            type: DataTypes.STRING,
            allowNull: false
          },
          infoFrom:{
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
        tableName : 'teacher_training'
    });

    return teacherTraining;
}