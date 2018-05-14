module.exports = init = (db) => {
  const users = db.collections('users');

  const getUsers = () => users.find({}).toArray();

  return {
    getUsers
  };
};