var express = require('express');
const Validator = require("fastest-validator");
const uuid = require('uuid')
var router = express.Router();
var XLSX = require("xlsx");
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});


let testNumber = 001;


const { registrant } = require('../models');

const v = new Validator();

router.post('/', async(req,res) =>{
    let uuidBytes = uuid.parse(uuid.v4());
    let uuidDataString = uuid.stringify(uuidBytes);

    const schema = {
        name: 'string',
        address: 'string',
        telephone: 'number'
    }

    const validate = v.validate(req.body, schema);

    if (validate.length){
        return res
        .status(400)
        .json(validate);
    }

    transporter.sendMail({
        from: process.env.SMTP_EMAIL,
        to: req.body.name, 
        subject: "Registration Success", 
        text: "No Ujian mu adalah " + testNumber
    }).then(info => {
        console.log({info});
        testNumber++;
    }).catch(console.error);


    const register = await registrant.create({
        
        id: uuidDataString,
        name: req.body.name,
        address: req.body.address,
        telephone: req.body.telephone
    });

    res.json(register);
});

router.post('/all-user', async (req,res) => {
    // Find all users
    const users = await registrant.findAll();
    console.log(users.every(user => user instanceof registrant)); // true
    
    const rows = users.map(row => ({
        name: row.name,
        address: row.address
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);

    XLSX.utils.sheet_add_aoa(worksheet, [["Name", "Address"]], { origin: "A1" });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Dates");

    XLSX.writeFile(workbook, "Registrants.xlsx", { compression: true });
    
    res.json({
      rows
    })
});

module.exports = router;