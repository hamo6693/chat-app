require("dotenv").config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


//stup 1
const mongoose = require("mongoose");
const createError = require("http-errors");

require("./socket-hondler");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/api/auth', require('./routes/auth'));
app.use('/api/account', require('./routes/account'));


app.use((err,req,res,next) => {
    if(err.name === 'MongoError' || err.name === 'ValidationError' || err.name === 'CastError'){
        err.status = 422;
    }
    console.log("internal server error 500",err);
    res.status(err.status ||500).json({message:err.message || 'some error eccured'});
});


app.use((err,req,res,next) => {
    if(req.get('accept').includes("json")){
        return next(createError(404));
    }
    res.status(404).sendFile(path.join(__dirname,'public','index.html'));
});



//stup 2
mongoose.connect(process.env.DB_URL, { useNewUrlParser: true }, err => {
    if (err) throw err;
             
    console.log("connected successfully");
});

module.exports = app;
