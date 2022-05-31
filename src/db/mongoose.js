const mongoose = require('mongoose');
const { database } = require('../config');
mongoose.connect(database);

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
    // await client
    // .db('node')
    // .collection('projects')
    // .insertOne({ client: "prosense",  description: "Lorem ipsum" });
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

