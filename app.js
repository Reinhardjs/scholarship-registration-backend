var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const app = express();

app.get("/", (req, res) => {
    res.send("Yo wassup, this is an api build with express, whoose v2!");
});

app.listen(1234);
