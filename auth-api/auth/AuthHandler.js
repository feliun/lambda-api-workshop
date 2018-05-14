const connectToDatabase = require('../db');
const initController = require('./controller');

module.exports.register = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(initController)
    .then(({ register }) => register(JSON.parse(event.body)))
    .then(session => ({
      statusCode: 200,
      body: JSON.stringify(session)
    }))
    .catch(err => ({
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'text/plain' },
      body: err.message
    }));
};

module.exports.login = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(initController)
    .then(({ login }) => login(JSON.parse(event.body)))
    .then(session => ({
      statusCode: 200,
      body: JSON.stringify(session)
    }))
    .catch(err => ({
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'text/plain' },
      body: { stack: err.stack, message: err.message }
    }));
};

module.exports.verify = (event, context, callback) => {
  // check header or url parameters or post parameters for token
  const token = event.authorizationToken;
  if (!token) return callback(null, 'Unauthorized');
  return connectToDatabase()
    .then(initController)
    .then((controller) =>
      controller.verify(token)
        .then((decoded) => controller.generatePolicy(decoded.id, 'Allow', event.methodArn))
    )
    .then((policy) => callback(null, policy))
    .catch((error) => {
      console.error(`Error verifying token: ${error.message}, ${error.stack}`);
      callback(null, policy);
    });
};

module.exports.me = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  console.log('event.requestContext.authorizer: ', event.requestContext.authorizer.principalId)
  return connectToDatabase()
    .then(initController)
    // the decoded.id from the VerifyToken.auth will be passed along as the principalId under the authorizer
    .then(({ me }) => me(event.requestContext.authorizer.principalId))
    .then(session => ({
      statusCode: 200,
      body: JSON.stringify(session)
    }))
    .catch(err => ({
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'text/plain' },
      body: { stack: err.stack, message: err.message }
    }));
};