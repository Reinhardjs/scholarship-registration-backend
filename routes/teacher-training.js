var express = require("express");
const Validator = require("fastest-validator");
var router = express.Router();
const nodemailer = require("nodemailer");
const session = require("express-session");
var XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.SMTP_EMAIL,
//     pass: process.env.SMTP_PASSWORD,
//   },
// });

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

const { teacherTraining } = require("../models");

const v = new Validator();

router.post("/register", async (req, res) => {
  const schema = {
    name: "string",
    gender: "string",
    age: "string",
    birthdate: "string",
    province: "string",
    city: "string",
    address: "string",
    telephone: "string",
    handphone: "string",
    email: "email",
    lastEducation: "string",
    university: "string",
    major: "string",
    ipk: "string",
    englishProficiency: "string",
    englishProficiencyScore: "string",
    jlpt: "string",
    teachingTime: "string",
    teachingLocation: "string",
    teachingProvince: "string",
    teachingCity: "string",
    teachingSubject: "string",
    testLocation: "string",
    infoFrom: "string",
  };

  const validate = v.validate(req.body, schema);

  if (validate.length) {
    return res.status(400).json(validate);
  }

  const checkDuplicate = await teacherTraining.findOne({
    where: { email: req.body.email },
  });
  if (checkDuplicate != null) {
    res.send(
      "Email sudah terdaftar. Silakan menggunakan alamat email yang lain."
    );
  } else {
    var countStudies = await teacherTraining.count();
    countStudies++;

    const headerStudies = "TEACHER TRAINING 2023";

    var str = "" + countStudies;
    var pad = "0000";
    if (req.body.testLocation === "Makassar") {
      var testId = "TU" + pad.substring(0, pad.length - str.length) + str;
    } else {
      var testId =
        "T" +
        req.body.testLocation.charAt(0).toUpperCase() +
        pad.substring(0, pad.length - str.length) +
        str;
    }

    transporter
      .sendMail({
        from: process.env.SMTP_EMAIL,
        to: req.body.email,
        subject: headerStudies,
        html:
          "Email Konfirmasi <br><br>" +
          "Berikut data anda yang telah berhasil didaftarkan<br><br>" +
          "<b>Nama Lengkap: " +
          req.body.name +
          "<br>No Ujian: " +
          testId +
          "<br>Lokasi Ujian: " +
          req.body.testLocation +
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

    const register = await teacherTraining.create({
      testId: testId,
      name: req.body.name,
      gender: req.body.gender,
      age: req.body.age,
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
      englishProficiencyScore: req.body.englishProficiencyScore,
      jlpt: req.body.jlpt,
      jlptScore: req.body.jlptScore,
      teachingTime: req.body.teachingTime,
      teachingLocation: req.body.teachingLocation,
      teachingProvince: req.body.teachingProvince,
      teachingCity: req.body.teachingCity,
      teachingSubject: req.body.teachingSubject,
      testLocation: req.body.testLocation,
      infoFrom: req.body.infoFrom,
    });

    res.json(register);
  }
});

module.exports = router;
