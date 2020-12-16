const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  // eslint-disable-next-line dot-notation
  const token = req.headers['x-access-token'] ? req.headers['x-access-token'] : req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ auth: false, message: 'No token provided.' });
  }

  jwt.verify(token, process.env.AUTH0_CLIENT_SECRET, (error, decoded) => {
    if (error) {
      return res.status(401).json({ auth: false, message: 'Unauthorized.' });
    }

    req.userId = decoded.id;
    next();
    return '';
  });

  return '';
};

const authJwt = {
  verifyToken,
};

module.exports = authJwt;
