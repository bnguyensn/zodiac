'use strict';

const express = require('express');
const router = express.Router();
const path = require('path');

router.get('*', (req, res, next) => {
    res.sendFile('index.html', {
        root: path.join(__dirname, '../dist'),
        maxAge: 31536000
    }, (e) => {
        (e) ? next(e) : console.log('Successfully sent index.html');
    });
});

module.exports = router;