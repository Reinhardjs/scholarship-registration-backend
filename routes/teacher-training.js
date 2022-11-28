var express = require('express');
const Validator = require("fastest-validator");
var router = express.Router();
const nodemailer = require('nodemailer');
const session = require('express-session');
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

const { teacherTraining } = require('../models');

const v = new Validator();

router.post('/register', async(req,res) =>{

    const schema = {
        name: 'string',
        gender: 'string',
        birthdate: 'string',
        province: 'string',
        city: 'string',
        address: 'string',
        telephone: 'string',
        handphone: 'string',
        email: 'email',
        lastEducation: 'string',
        university: 'string',
        major: 'string',
        ipk: 'string',
        englishProficiency: 'string',
        jlpt: 'string',
        teachingTime: 'string',
        teachingLocation: 'string',
        teachingProvince: 'string',
        teachingCity: 'string',
        teachingSubject: 'string',
        testLocation: 'string'
    }

    const validate = v.validate(req.body, schema);

    if (validate.length){
        return res
        .status(400)
        .json(validate);
    }

    const checkDuplicate = await teacherTraining.findOne({ where: { email: req.body.email }});
    if(checkDuplicate != null){
        res.send("Email Already Used");
    }else{
        var countStudies = await teacherTraining.count();
    countStudies++;
    
    const headerStudies = "PROGRAM TEACHER TRAINING 2022"

    var str = "" + countStudies
    var pad = "0000"
    if(req.body.testLocation === "Makassar"){
        var testId = "TU" + pad.substring(0, pad.length - str.length) + str
    }else{
        var testId = "T" + req.body.testLocation.charAt(0).toUpperCase() + pad.substring(0, pad.length - str.length) + str
    }
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

    const register = await teacherTraining.create({
        testId: testId,
        name: req.body.name,
        gender: req.body.gender,
        birthdate: req.body.birthdate,
        lastEducation: req.body.lastEducation,
        province: req.body.province,
        city: req.body.city,
        address: req.body.address,
        telephone: req.body.telephone,
        handphone: req.body.handphone,
        email: req.body.email,
        university: req.body.university,
        major: req.body.major,
        ipk: req.body.ipk,
        englishProficiency: req.body.englishProficiency,
        jlpt: req.body.jlpt,
        jlptScore: req.body.jlptScore,
        teachingTime: req.body.teachingTime,
        teachingLocation: req.body.teachingLocation,
        teachingProvince: req.body.teachingProvince,
        teachingCity: req.body.teachingCity,
        teachingSubject: req.body.teachingSubject,
        testLocation: req.body.testLocation
    });

    res.json(register);
    }
});



module.exports = router;