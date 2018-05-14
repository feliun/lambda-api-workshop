const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens

module.exports = init = (db) => {

  const users = db.collection('users');

  const getUser = (criteria, options = {}) => users.findOne(criteria, options);

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

  const register = (eventBody) =>
    validate(eventBody)
      .then(() => getUser({ email: eventBody.email }))
      .then(user =>
        user
          ? Promise.reject(new Error('User with that email exists.'))
          : bcrypt.hash(eventBody.password, 8)
      )
      .then(hash => saveUser({ name: eventBody.name, email: eventBody.email, password: hash }))
      .then(user => ({ auth: true, token: signToken(user._id) }));

  const comparePassword = (eventPassword, userPassword, userId) =>
    bcrypt.compare(eventPassword, userPassword)
      .then(passwordIsValid =>
        !passwordIsValid
          ? Promise.reject(new Error('The credentials do not match.'))
          : signToken(userId)
      );

  const login = (eventBody) =>
    getUser({ email: eventBody.email })
      .then(user =>
        !user
          ? Promise.reject(new Error('User with that email does not exits.'))
          : comparePassword(eventBody.password, user.password, user._id)
      )
      .then(token => ({ auth: true, token: token }));

  const verify = (token) => new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return reject(err);
      resolve(decoded);
    });
  });

  const generatePolicy = (principalId, effect, resource) => {
    const authResponse = { principalId };
    if (effect && resource) {
      authResponse['policyDocument'] = {
        Version: '2012-10-17',
        Statement:[
          {
            Action: 'execute-api:Invoke',
            Effect: effect,
            Resource: resource
          }
        ]
      };
    }
    return authResponse;
  };

  const me = (userId) =>
    getUser({ id: userId }, { password: 0 })
      .then(user =>
        !user
          ? Promise.reject('No user found.')
          : user
      )
      .catch(err => Promise.reject(new Error(err)));

  return {
    register,
    login,
    verify,
    generatePolicy,
    me,
  };
};