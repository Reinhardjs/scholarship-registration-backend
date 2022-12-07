var express = require('express');
var router = express.Router();
const session = require('express-session');
const path = require('path');
var XLSX = require("xlsx");
const fs = require('fs');

const { user } = require('../models');
const { teacherTraining } = require('../models');
const { japaneseStudies } = require('../models');



/* post home page. */
router.post('/login', async(req, res, next) =>{
	let username = req.body.username;
	let password = req.body.password;
	if (username && password) {
    const authUser = await user.findAll({ where: { 
      username: username,
      password: password }});
    if (authUser.length > 0) {
      req.session.loggedin = true;
      req.session.username = username;
      res.send('Login Successful');
    } else {
      res.json('Incorrect Username and/or Password!');
    }			

	} else {
		res.send('Please enter Username and Password!');
		res.end();
	}
});

router.post('/change-password', async(req, res, next) =>{
	let username = req.session.username;
	let password = req.body.password;
	if (req.session.loggedin) {
    const authUser = await user.findOne({ where: { 
      username: username
     }});

     authUser.password = password;
     await authUser.save();
     res.send('Successfully Changed Password');
	}else{
    res.send('Please login to view this page!');
}
});

router.post('/logout', async(req, res, next) =>{
	req.session.destroy((err) => {
    if(err) {
        return console.log(err);
    }
    // Hapus cokie yang masih tertinggal
    res.clearCookie('secretname');
    res.send('Logout Successful');
  });
});

router.post('/teacher-training/view', async(req, res, next) =>{
	if (req.session.loggedin) {
    const users = await teacherTraining.findAll({order: [['id', 'ASC']]});
    const count = await teacherTraining.count();
    res.json({
      count: count,
      data: users
    });
	}else{
    res.send('Please login to view this page!');
}
});

router.post('/japanese-studies/view', async(req, res, next) =>{
	if (req.session.loggedin) {
    const users = await japaneseStudies.findAll({order: [['id', 'ASC']]});
    const count = await japaneseStudies.count();
    res.json({
      count: count,
      data: users
    });
	}else{
    res.send('Please login to view this page!');
}
});


router.post('/teacher-training/download-excel', async (req,res) => {
  // Find all users
  if(req.session.loggedin){
      const users = await teacherTraining.findAll({order: [['id', 'ASC']]});
      console.log(users.every(user => user instanceof teacherTraining)); // true
      
      const rows = users.map(row => ({
        id: row.id,
          testId: row.testId,
          name: row.name,
          gender: row.gender,
          birthdate: row.birthdate,
          age: row.age,
          lastEducation: row.lastEducation,
          province: row.province,
          city: row.city,
          address: row.address,
          telephone: row.telephone,
          handphone: row.handphone,
          email: row.email,
          university: row.university,
          major: row.major,
          ipk: row.ipk,
          englishProficiency: row.englishProficiency,
          englishProficiencyScore: row.englishProficiencyScore,
          jlpt: row.jlpt,
          jlptScore: row.jlptScore,
          teachingTime: row.teachingTime,
          teachingLocation: row.teachingLocation,
          teachingProvince: row.teachingProvince,
          teachingCity: row.teachingCity,
          teachingSubject: row.teachingSubject,
          testLocation: row.testLocation,
          infoFrom: row.infoFrom
      }));
  
      const worksheet = XLSX.utils.json_to_sheet(rows);
      const header = ["No", "Test Number","Name", "Gender", "Birthdate", "Age", "Last Education", "Province", "City", "Address", "Handphone", "Telephone",  "Email", "University"
      , "Major", "IPK", "English Proficiency" , "TOEFL Score","JLPT", "JLPT Score", "Teaching Time", "Teaching Location" , "Teaching Province" , "Teaching City" , "Teaching Subject" , "Test Location", "Information From"];
  
      XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: "A1" });
  
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Dates");
  
      const downloadFolder = path.resolve(__dirname, "../downloads");
      
      if (!fs.existsSync(downloadFolder)) {
          fs.mkdirSync(downloadFolder);
      }
      try {
  
          XLSX.writeFile(workbook, "downloads/teacherTraining.xlsx", { compression: true });
      
          res.download("downloads/teacherTraining.xlsx");
          
      } catch (error) {
          console.log(error.message);
          throw error;
      }
  }else{
      res.send('Please login to view this page!');
  }
  
});

router.post('/japanese-studies/download-excel', async (req,res) => {
  // Find all users
  if(req.session.loggedin){
      const users = await japaneseStudies.findAll({order: [['id', 'ASC']]});
      console.log(users.every(user => user instanceof teacherTraining)); // true
      
      const rows = users.map(row => ({
        id: row.id,
          testId: row.testId,
          name: row.name,
          gender: row.gender,
          birthdate: row.birthdate,
          age: row.age,
          japaneseResident: row.japaneseResident,
          address: row.address,
          province: row.province,
          city: row.city,
          handphone: row.handphone,
          telephone: row.telephone,
          email: row.email,
          university: row.university,
          semester: row.semester,
          ipk: row.ipk,
          jlpt: row.jlpt,
          jlptScore: row.jlptScore,
          testLocation: row.testLocation,
          infoFrom: row.infoFrom
      }));
  
      const worksheet = XLSX.utils.json_to_sheet(rows);
      const header = ["No","Test Number","Name", "Gender", "Birthdate", "Age", "Japanese Resident", "Address", "Province", "City", "Handphone", "Telephone",  "Email", "University"
      , "Major", "IPK" , "JLPT", "JLPT Score", "Test Location", "Information From"];
  
      XLSX.utils.sheet_add_aoa(worksheet, [header], { origin: "A1" });
  
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Dates");
  
      const downloadFolder = path.resolve(__dirname, "../downloads");
      
      if (!fs.existsSync(downloadFolder)) {
          fs.mkdirSync(downloadFolder);
      }
      try {
  
          XLSX.writeFile(workbook, "downloads/japaneseStudies.xlsx", { compression: true });
      
          res.download("downloads/japaneseStudies.xlsx");
          
      } catch (error) {
          console.log(error.message);
          throw error;
      }
  }else{
      res.send('Please login to view this page!');
  }
  
});

module.exports = router;
