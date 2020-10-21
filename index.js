const helpers = require('./helpers');
const Q1 = require('./q1');
const Q3 = require('./q3');
const Q4 = require('./q4');

(async() => {
  try {
    const client = await helpers.connect();

    await Q1.run(client);
    await Q3.run(client);
    await Q4.run(client);

    await client.close();
  } catch (e) {
    console.log(e);
  }
})();