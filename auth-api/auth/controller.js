module.exports = init = (db) => {

  const users = db.collections('users');

  const getUser = (email) => users.findOne({ email });

  const saveUser = (user) => users.insert(user);

  const validate = (eventBody) => {
    if (!(eventBody.password && eventBody.password.length >= 7))
      return Promise.reject(new Error('Password error. Password needs to be longer than 8 characters.'));

    if (!(eventBody.name && eventBody.name.length > 5 && typeof eventBody.name === 'string'))
      return Promise.reject(new Error('Username error. Username needs to longer than 5 characters'));

    if (!(eventBody.email && typeof eventBody.name === 'string'))
      return Promise.reject(new Error('Email error. Email must have valid characters.'));

    return Promise.resolve();
  }

  const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: 86400 });

  const register = (eventBody) => {
    return validate(eventBody)
      .then(() => getUser(eventBody.email))
      .then(user =>
        user
          ? Promise.reject(new Error('User with that email exists.'))
          : bcrypt.hash(eventBody.password, 8)
      )
      .then(hash => saveUser({ name: eventBody.name, email: eventBody.email, password: hash }))
      .then(user => ({ auth: true, token: signToken(user._id) }));
  };

  const comparePassword = (eventPassword, userPassword, userId) => {
    return bcrypt.compare(eventPassword, userPassword)
      .then(passwordIsValid =>
        !passwordIsValid
          ? Promise.reject(new Error('The credentials do not match.'))
          : signToken(userId)
      );
  };

  const login = (eventBody) => {
    return getUser({ email: eventBody.email })
      .then(user =>
        !user
          ? Promise.reject(new Error('User with that email does not exits.'))
          : comparePassword(eventBody.password, user.password, user._id)
      )
      .then(token => ({ auth: true, token: token }));
  };

  return {
    register,
    login,
  };
};