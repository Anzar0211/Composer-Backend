"use strict";
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookie = require("cookie-parser");


exports.protocol="http";
exports.host="localhost";
exports.port=90;
exports.address = `${exports.protocol}://${exports.host}:${exports.port}`;

exports.message=function(){
    console.log(`Server is running on ${exports.address}`);    
}

exports.cors=cors()

exports.cookie = cookie();
exports.urlEncoded = express.urlencoded({ extended: true });
exports.json = express.json();

exports.morgan = morgan("dev");