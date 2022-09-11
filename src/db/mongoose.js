const mongoose = require('mongoose');
const { database } = require('../config');
mongoose.connect(database);

// UTC Timezone
// const utc = new Date();
// utc.setHours( utc.getHours() + 2);
const moment = require('moment-timezone');
const utc = moment.tz(Date.now(), "Europe/Warsaw").format();

