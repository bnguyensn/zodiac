const dotenv = require('dotenv').config();
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');  // Needed to access POST requests' data
const helmet = require('helmet');  // Production security package

// Load router modules (always have /index)
const index = require('./server/routes/index');

const app = express();  // Create the express app

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /src
//app.use(favicon(path.join(__dirname, 'src', 'favicon.ico')));

// Set up the port
app.set('port', process.env.PORT || 63343);

/** ********** LOAD MIDDLEWARES ********** **/

// Default middlewares
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

// Production security
app.use(helmet());
app.use(helmet.contentSecurityPolicy({
    directives: {
        // defaultSrc: ['https:'],  // This won't work for local builds
        scriptSrc: ["'self'"],
        styleSrc: ["'unsafe-inline'", "'self'", 'https://fonts.googleapis.com'],
        objectSrc: ["'none'"],
        reportUri: 'https://cspreport.bnguyensn.com'
    }
}));

// The folder where generated production client files are
app.use(express.static(path.join(__dirname, 'dist'), {
    maxAge: 31536000
}));

// After loading the router modules above, we attach website paths to them
// This is just like loading a middleware
app.use('/', index);

/** ********** ERROR HANDLING ********** **/

// Catch 404
app.use(function (req, res, next) {
    let err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Error handler
app.use(function (err, req, res, next) {
    if (res.headersSent) return next(err);

    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

/** ********** START THE APP ********** **/

app.listen(app.get('port'), () => {
    console.log(`app live on port ${app.get('port')}`)
});

module.exports = app;