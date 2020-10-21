# mongo-exercise

Since I wasn't instructed to use any specific libraries, I decided to use the base mongodb driver for node instead of more advanced libraries like Mongoose in order to get more familiar with the barebones MongoDB experience.

For the first exercises' input CSV, I decided to make a simple mock stream that simulates reading from a CSV.

Each question has sample code of my solution along with a demonstration that it works in its own file, with a couple helper functions in the `helpers.js` file. Regarding question nº 2, I didn't include a sample solution, but I'd probably use an ORM like Sequelize, specifically its `bulkInsert` method ([link to documentation](https://sequelize.org/master/class/lib/dialects/abstract/query-interface.js~QueryInterface.html#instance-method-bulkInsert)).