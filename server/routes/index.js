'use strict';

const express = require('express');
const router = express.Router();
const path = require('path');
const createCNYlist = require('../js/createCNYlist');

router.get('/', (req, res, next) => {
    res.sendFile('index.html', {
        root: path.join(__dirname, '../dist'),
        maxAge: 31536000
    }, (e) => {
        (e) ? next(e) : console.log('Successfully sent index.html');
    });
});

/**
 * A router to handle requests wanting to obtain a .json file containing a list of Chinese New Year
 * The GET request should be in the form '/cnylist?from=xxxx&to=xxxx&step=x'
 * to and step should be optional
 * */
router.get('/cnylist', (req, res, next) => {
    const req_from = req.query.from;
    const req_to = req.query.to;
    const req_step = req.query.step;

    // TODO: this should be a promise
    const cny_list = createCNYlist.createCNylist(req_from, req_to, req_step);


});

module.exports = router;