var express = require('express');
const Validator = require("fastest-validator");
const uuid = require('uuid')
var router = express.Router();

const { japanese_studies } = require('../models');

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
        birthdate: 'date',
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


    const register = await japanese_studies.create({
        id: uuidDataString,
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
});

module.exports = router;