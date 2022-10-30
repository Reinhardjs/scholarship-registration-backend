var express = require('express');
const Validator = require("fastest-validator");
const uuid = require('uuid')
var router = express.Router();

let uuidBytes = uuid.parse(uuid.v4());
let uuidDataString = uuid.stringify(uuidBytes);

const { registrant } = require('../models');

const v = new Validator();

router.post('/', async(req,res) =>{
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


    const register = await registrant.create({
        id: uuidDataString,
        name: req.body.name,
        address: req.body.address,
        telephone: req.body.telephone
    });

    res.json(register);
});

module.exports = router;