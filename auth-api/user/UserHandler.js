const connectToDatabase = require('../db');
const initUser = require('../model/user');

module.exports.getUsers = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(initUser)
    .then(({ getUsers }) => getUsers())
    .then(users => ({
      statusCode: 200,
      body: JSON.stringify(users)
    }))
    .catch(err => ({
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ message: err.message })
    }));
};