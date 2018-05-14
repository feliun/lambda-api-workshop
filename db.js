const { connect } = require('mongodb');

let mongo;

module.exports = connectToDatabase = () => {
  if (mongo) {
    console.log('Using existing database connection...');
    return Promise.resolve(mongo);
  }
  console.log('Creating new database connection');
  return connect(process.env.DB, { useNewUrlParser: true })
    .then(db => {
      mongo = db;
      return db;
    });
};