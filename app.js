var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const http = require("http");
const cors = require('cors');
var indexRouter = require('./src/routes/index');
var usersRouter = require('./src/routes/users');



var app = express();

const host = 'localhost';
const port = 3005;

const server = http.createServer(app);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(cors());
app.use('/', indexRouter);
app.use('/users', usersRouter);


server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});





module.exports = app;
