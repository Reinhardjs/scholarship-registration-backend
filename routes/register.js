var express = require('express');
const Validator = require("fastest-validator");
const uuid = require('uuid')
var router = express.Router();
var XLSX = require("xlsx");
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});


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
    const testNumber = 1;

    if (validate.length){
        return res
        .status(400)
        .json(validate);
    }

    const count = await registrant.count();

    transporter.sendMail({
        from: process.env.SMTP_EMAIL,
        to: req.body.name, 
        subject: "Registration Success", 
        text: "No Ujian mu adalah " + testNumber + " kamu adalah pendaftar ke " + count
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

router.get('/all-user', async (req,res) => {
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

    const downloadFolder = path.resolve(__dirname, "../downloads");
    
    if (!fs.existsSync(downloadFolder)) {
        fs.mkdirSync(downloadFolder);
    }
    try {

        XLSX.writeFile(workbook, "downloads/Registrants.xlsx", { compression: true });
    
        res.download("downloads/Registrants.xlsx");
        
    } catch (error) {
        console.log(error.message);
        throw error;
    }
    
});

module.exports = router;