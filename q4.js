const helpers = require('./helpers');

async function solutionFriendsOfFriends(db, id, depth) {
  // Here I'm asuming that the graph is directed. (so if 1 is friends with 2,
  // 2 might not necessarily be friends with 1).
  return await db.collection('friends').aggregate([
    { $match: { id: id } },
    {
      $graphLookup: {
        from: 'friends',
        startWith:'$id',
        connectFromField: 'friendId',
        connectToField: 'id',
        as: 'friends',
        maxDepth: depth - 1
      }
    }, 
    { $limit: 1 },
    {
      $project: {
        friendsOfFriends: {
          $map: {
            input: '$friends',
            as: 'friend',
            in: '$$friend.friendId'
          }
        }
      }
    }
  ]).toArray();
};

async function run(client) {
  // Create a temp db for the exercise and populate it with some sample data.
  const db = client.db('Q4DB');
  let bulk = db.collection('friends').initializeUnorderedBulkOp();
  // Renamed _id field to id to avoid duplicate primary key errors.
  bulk.insert({id: 1, friendId: 2});
  bulk.insert({id: 1, friendId: 3});
  bulk.insert({id: 2, friendId: 4});
  bulk.insert({id: 4, friendId: 5});
  bulk.insert({id: 6, friendId: 7});
  await bulk.execute();

  console.log('Q4: created temp db and generated sample data, proceeding to run first query.');

  // Run the solution to the exercise and check that it's right.
  let friendsOfFriends = await solutionFriendsOfFriends(db, 1, 2);
  console.log('Q4: friends of friends result: ', friendsOfFriends[0].friendsOfFriends);
  console.log('Q4: friends of friends expected result: [2, 3, 4]');

  // Check that it works properly for different depths and users
  friendsOfFriends = await solutionFriendsOfFriends(db, 1, 3);
  console.log('Q4: friends of friends result: ', friendsOfFriends[0].friendsOfFriends);
  console.log('Q4: friends of friends expected result: [2, 3, 4, 5]');

  friendsOfFriends = await solutionFriendsOfFriends(db, 2, 1);
  console.log('Q4: friends of friends result: ', friendsOfFriends[0].friendsOfFriends);
  console.log('Q4: friends of friends expected result: [4]');

  // Drop the temp db to make sure it's clean on subsequent runs.
  await db.dropDatabase();

  console.log('Q4: dropped temp db.'); 
};

module.exports = {
  run: run
}