var express = require('express');

const app = express();

app.get("/", (req, res) => {
    res.send("Yo wassup, this is an api build with express, whoos!");
});

app.listen(1234);
