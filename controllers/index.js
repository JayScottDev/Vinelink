'use strict';

const fs = require('fs');

const ctrlFiles = fs.readdirSync('./controllers');

for (let file of ctrlFiles) {
  if (file.startsWith('index')) continue;
  let name = file.replace(/\..*/, ''); // remove extension from file name
  let ctrl = require(`./${file}`);
  module.exports[name] = ctrl;
}
