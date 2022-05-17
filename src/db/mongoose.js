const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/node');

// UTC Timezone
// const utc = new Date();
// utc.setHours( utc.getHours() + 2);
const moment = require('moment-timezone');
const utc = moment.tz(Date.now(), "Europe/Warsaw").format();

async function newRecord() {
    // const projects = new Projects({
    //     client: 'Hullo',
    //     description: 'New hullo page',
    // })

    // await projects.save();
    // await Projects.create({
    //     slug: "slug",
    //     age: 19
    // })
    // await Users.create({
    //     name: "Hubert Kruczek",
    //     email: "hubercik@gmail.com",
    // })
}
newRecord().catch((e) => {
    for (const key in e.errors) {
        console.log(e.errors[key].message)
    }
}
);

