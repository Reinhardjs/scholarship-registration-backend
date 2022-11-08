var express = require('express');
const Validator = require("fastest-validator");
const uuid = require('uuid')
var router = express.Router();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

const { japaneseStudies } = require('../models');

const v = new Validator();

router.post('/', async(req,res) =>{
    let uuidBytes = uuid.parse(uuid.v4());
    let uuidDataString = uuid.stringify(uuidBytes);

    const schema = {
        name: 'string',
        address: 'string',
        telephone: 'string',
        handphone: 'string',
        gender: 'string',
        birthdate: 'string',
        email: 'email',
        japaneseResident: 'string',
        province: 'string',
        city: 'string',
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
        testNumber++;
    }).catch(console.error);



    const register = await japaneseStudies.create({
        id: uuidDataString,
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

module.exports = router;