'use strict';

const fs = require('fs');
const path = require('path');

function createCNYlist() {
    
}

function writeCNYlist(data) {
    const fileName = 'cnylist.json';
    fs.writeFile(fileName, data, (err) => {
        if (err) throw err;
        console.log(`Successfully created a Chinese New Year list at ${path.join(__dirname, fileName)}`);
    })
}

