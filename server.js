const express = require('express');
const app = express();

app.use("/", require("./app"))

module.exports = app;