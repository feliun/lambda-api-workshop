module.exports = init = (db) => {
  const users = db.collection('users');

  const getUsers = () => users.find({}).toArray();
  const getUser = (criteria, options = {}) => users.findOne(criteria, options);
  const saveUser = (user) => users.insert(user).then((({ ops }) => ops[0]));

  return Promise.resolve({
    getUsers,
    getUser,
    saveUser,
  });
};