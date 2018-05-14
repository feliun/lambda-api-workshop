module.exports = init = (db) => {
  const users = db.collection('users');

  const getUsers = () => users.find({}).toArray();

  return {
    getUsers
  };
};