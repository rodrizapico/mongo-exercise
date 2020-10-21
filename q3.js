const helpers = require('./helpers');

async function solutionSumCustomer(db) {
  return await db.collection('orders').aggregate([
    {
      $group: {
        _id: '$customerId',
        sum: { $sum: '$amount' }
      }
    }
  ]).toArray();
};

async function solutionSumCustomerYear(db) {
  return await db.collection('orders').aggregate([
    {
      $group: {
        _id: { customerId: '$customerId', year: { $year: '$createdDate'} },
        sum: { $sum: '$amount' }
      }
    }
  ]).toArray();
};

async function run(client) {
  // Create a temp db for the exercise and populate it with some sample data.
  const db = client.db('Q3DB');
  let bulk = db.collection('orders').initializeUnorderedBulkOp();
  bulk.insert({customerId: 1, amount: 50, createdDate: new Date('2020-01-01')});
  bulk.insert({customerId: 1, amount: 20, createdDate: new Date('2020-12-31')});
  bulk.insert({customerId: 2, amount: 110, createdDate: new Date('2020-03-11')});
  bulk.insert({customerId: 2, amount: 65, createdDate: new Date('1999-03-11')});
  bulk.insert({customerId: 3, amount: 42, createdDate: new Date('2019-10-12')});
  await bulk.execute();


  console.log('Q3: created temp db and generated sample data, proceeding to run first query.');

  // Run the solution to the exercise and check that it's right.
  let sumResult = await solutionSumCustomer(db);
  console.log(
    'Q3: sum by customer result: ', 
    sumResult
  );
  console.log('Q3: expected result is 1 - 70, 2 - 175, 3 - 42');

  // Run the solution to the exercise and check that it's right.
  sumResult = await solutionSumCustomerYear(db);
  console.log(
    'Q3: sum by customer and year result: ', 
    sumResult
  );
  console.log('Q3: expected result is (1, 2020) - 70, (2, 2020) - 110, (2, 1999) - 65, (3, 2019) - 42');

  // Drop the temp db to make sure it's clean on subsequent runs.
  await db.dropDatabase();

  console.log('Q3: dropped temp db.'); 
};

module.exports = {
  run: run
}