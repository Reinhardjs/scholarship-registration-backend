var express = require('express');
var router = express.Router();
const session = require('express-session');
const path = require('path');
var XLSX = require("xlsx");
const fs = require('fs');
const nodemailer = require("nodemailer");

const { user } = require('../models');
const { teacherTraining } = require('../models');
const { japaneseStudies } = require('../models');

const transporter = nodemailer.createTransport({
  pool: true,
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true, // use TLS
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});



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

router.post('/resend-email', async(req, res, next) =>{
	if (req.session.loggedin) {
    var user = null;
    var headerStudies = "";
    

    if(req.body.table == 'Japanese Studies'){
      headerStudies = "JAPANESE STUDIES 2023";
      user = await japaneseStudies.findOne({ where: { email: req.body.email } });
      if (user == null) {
        res.send('User Not found!');
      } else{
        resendEmail(user, headerStudies);
        res.send('Email Sent Successfully');
      }
    }else{
      headerStudies = "TEACHER TRAINING 2023";
      user = await teacherTraining.findOne({ where: { email: req.body.email } });
      if (user === null) {
        res.send('User Not found!');
      } else{
        resendEmail(user, headerStudies);
        res.send('Email Sent Successfully');
      }
    }
  
	}else{
    res.send('Please login to view this page!');
}
});

function resendEmail(user, headerStudies){
  transporter
      .sendMail({
        from: process.env.SMTP_EMAIL,
        to: user.email,
        subject: headerStudies,
        html:
          "Email Konfirmasi <br><br>" +
          "Berikut data anda yang telah berhasil didaftarkan<br><br>" +
          "<b>Nama Lengkap: " +
          user.name +
          "<br>No Ujian: " +
          user.testId +
          "<br>Lokasi Ujian: " +
          user.testLocation +
          "</b><br><br>" +
          'Cetak/print email ini untuk melengkapi poin 1 "Dokumen yang diperlukan" dan kirimkan bersama dokumen lainnya melalui jasa pengiriman / serahkan ke Kedutaan Besar Jepang paling lambat <b>18 Januari 2023</b>' +
          "<br><br>Selain berkas yang dikirimkan, silakan simpan 1 rangkap berkas untuk arsip pribadi Anda. <br>" +
          "Harap diperhatikan bahwa Nomor Ujian hanya diberikan satu kali.<br>" +
          "Nomor Ujian akan digunakan selama proses seleksi berlangsung",
      })
      .then((info) => {
        console.log({ info });
      })
      .catch(console.error);
}


router.get('/teacher-training/download-excel', async (req,res) => {
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
          address: row.address,
          province: row.province,
          city: row.city,
          telephone: row.telephone,
          handphone: row.handphone,
          email: row.email,
          lastEducation: row.lastEducation,
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
      const header = ["No", "Test Number","Name", "Gender", "Birthdate", "Age",  "Address","Province", "City",  "Handphone", "Telephone",  "Email", "Last Education", "University"
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

router.get('/japanese-studies/download-excel', async (req,res) => {
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
      const header = ["No","Test Number","Name", "Gender", "Birthdate", "Age", "Status WNJ", "Address", "Province", "City", "Handphone", "Telephone",  "Email", "University"
      , "Semester", "IPK" , "JLPT", "JLPT Score", "Test Location", "Information From"];
  
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
