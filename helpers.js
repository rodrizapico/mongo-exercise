const MongoClient = require('mongodb').MongoClient;
const generate = require('csv-generate');

const url = 'mongodb://database:27017';

async function connect() {
  try {
    const client = await MongoClient.connect(url, {
      useUnifiedTopology: true
    });
    console.log("Successfully connected to database");
    return client;
  } catch (e) {
    console.log("Error connecting to database:", e);
  }
}

function getCsvStream(column_types, length) {
  return generate({
    columns: column_types,
    length: length,
    objectMode: true
  });
}

function buildDocument(keys, values) {
  let newDoc = {};
  for (i = 0; i < keys.length; i++) {
    newDoc[keys[i]] = values[i];
  }
  return newDoc;
}

module.exports = {
  connect: connect,
  getCsvStream: getCsvStream,
  buildDocument: buildDocument
}