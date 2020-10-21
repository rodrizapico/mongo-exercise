const helpers = require('./helpers');

// I'm going to generate random data to simulate the input CSV. These are the
// parameters to generate it.
const column_names = ['name', 'surname', 'retired', 'age', 'phone', 'address']
const column_types = ['ascii', 'ascii', 'bool', 'int', 'int', 'ascii'];
const length = 5000;

async function solution(stream, db) {
  // Initialize an unordered bulk operation to make the insertions.
  let bulk = db.collection('people').initializeUnorderedBulkOp();

  // Wrap in a promise so we only return once we're done reading from ths stream.
  await new Promise((resolve, reject) => {
    stream
    .on('readable', function() {
      let record;
      while (record = this.read()) {
        // As we read rows from the 'CSV', we create the corresponding document
        // by building a JSON object with the 'CSV' keys, then add it to the
        // bulk operation.
        var newDoc = helpers.buildDocument(column_names, record);
        bulk.insert(newDoc);
      }
    })
    .on('error', function(err) {
      reject(err);
    })
    .on('end', async function() {
      resolve();
    });
  });

  // Run the bulk operation.
  await bulk.execute();
};

async function run(client) {
  // Create a temp db for the exercise.
  const db = client.db('Q1DB');

  let csvStream = helpers.getCsvStream(column_types, length);

  console.log('Q1: created temp db and generated input stream, proceeding to insert.');

  // Run the solution to the exercise.
  await solution(csvStream, db);

  console.log(
    'Q1: after insert, collection contains', 
    await db.collection('people').estimatedDocumentCount(), 
    'documents.'
  );

  // Drop the temp db to make sure it's clean on subsequent runs.
  await db.dropDatabase();

  console.log('Q1: dropped temp db.');  
};

module.exports = {
  run: run
}