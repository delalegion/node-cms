const { MongoClient } = require('mongodb');

const client = new MongoClient('mongodb://localhost:27017');

async function main() {
    await client.connect();

    // await client
    // .db('node')
    // .collection('projects')
    // .insertOne({ client: "prosense",  description: "Lorem ipsum" });
}

main();