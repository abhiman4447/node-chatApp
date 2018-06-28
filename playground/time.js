const moment = require('moment');

//Jan 1st 1970 00:00:10 am

var date = moment();
date.add(2, 'year').subtract(5, 'M');
console.log(date.format("MMM Do YYYY HH:mm:ss A"));

//1:03 am

var time = moment();
time.set("hour", 1);
time.set("minutes", 5);
console.log(time.format("H:mm A"));


