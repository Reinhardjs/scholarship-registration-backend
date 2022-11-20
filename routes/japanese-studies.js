var express = require('express');
const Validator = require("fastest-validator");
var router = express.Router();
const nodemailer = require('nodemailer');
var XLSX = require("xlsx");
const path = require('path');
const fs = require('fs');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

const { japaneseStudies } = require('../models');

const v = new Validator();

router.post('/register', async(req,res) =>{

    const schema = {
        name: 'string',
        gender: 'string',
        birthdate: 'string',
        japaneseResident: 'string',
        province: 'string',
        city: 'string',
        address: 'string',
        telephone: 'string',
        handphone: 'string',
        email: 'email',
        university: 'string',
        semester: 'string',
        ipk: 'string',
        jlpt: 'string',
        jlptScore: 'string',
        testLocation: 'string'
    }

    const validate = v.validate(req.body, schema);

    if (validate.length){
        return res
        .status(400)
        .json(validate);
    }

    const checkDuplicate = await japaneseStudies.findOne({ where: { email: req.body.email }});
    if(checkDuplicate != null){
        res.send("Email Already Used");
    }else{
        var countStudies = await japaneseStudies.count();
    countStudies++;
    
    const headerStudies = "PROGRAM JAPANESE STUDIES 2022"

    var str = "" + countStudies
    var pad = "0000"
    var testId = "J" + req.body.city.charAt(0).toUpperCase() + pad.substring(0, pad.length - str.length) + str

    transporter.sendMail({
        from: process.env.SMTP_EMAIL,
        to: req.body.email, 
        subject: headerStudies, 
        html: "<b>"+headerStudies+ "</b>" +"<br><br>Berikut data anda yang telah berhasil didaftarkan<br><br><b>Nama Lengkap: " + req.body.name
        + "<br>No Ujian: " + testId + "<br>Lokasi Ujian: " + req.body.testLocation
        + "<br>Lengkapi berkas dan serahkan secara langsung atau kirimkan melalui pos ke Kedutaan Besar Jepang paling lambat 13 Januari 2022.<br><br>"
        + "Selain berkas yang akan dikirimkan, silakan simpan 1 rangkap berkas untuk arsip pribadi Anda.<br>"
        + "Harap diperhatikan bahwa Nomor Ujian akan digunakan selama proses seleksi berlangsung, nomor ujian juga terdapat pada screenshot kartu pada saat anda selesai melakukan registrasi.<br><br>"
        + "Mohon simpan dengan baik dan jangan sampai hilang.</b>"
    }).then(info => {
        console.log({info});
    }).catch(console.error);

    const register = await japaneseStudies.create({
        testId: testId,
        name: req.body.name,
        gender: req.body.gender,
        birthdate: req.body.birthdate,
        japaneseResident: req.body.japaneseResident,
        province: req.body.province,
        city: req.body.city,
        address: req.body.address,
        telephone: req.body.telephone,
        handphone: req.body.handphone,
        email: req.body.email,
        university: req.body.university,
        semester: req.body.semester,
        ipk: req.body.ipk,
        jlpt: req.body.jlpt,
        jlptScore: req.body.jlptScore,
        testLocation: req.body.testLocation
    });

    res.json(register);
    }
});

router.get('/download-excel', async (req,res) => {
    // Find all users
    const users = await japaneseStudies.findAll();
    console.log(users.every(user => user instanceof japaneseStudies)); // true
    
    const rows = users.map(row => ({
        testId: row.testId,
        name: row.name,
        gender: row.gender,
        birthdate: row.birthdate,
        japaneseResident: row.japaneseResident,
        province: row.province,
        city: row.city,
        address: row.address,
        telephone: row.telephone,
        handphone: row.handphone,
        email: row.email,
        university: row.university,
        semester: row.semester,
        ipk: row.ipk,
        jlpt: row.jlpt,
        jlptScore: row.jlptScore,
        testLocation: row.testLocation
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const header = ["Test Number","Name", "Gender", "Birthdate", "Japanese Resident?", "Province", "City", "Address", "Telephone", "Handphone", "Email", "University"
    , "Semester", "IPK", "JLPT", "JLPT Score", "Test Location"];

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
    
});

module.exports = router;