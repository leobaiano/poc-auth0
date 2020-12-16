const { Router } = require('express');
const authJwt = require('../../../../utils/auth');

module.exports = Router({ mergeParams: true })
  .get('/v1/users', authJwt.verifyToken, async (req, res, next) => {
    try {
      const users = await req.db.User.find();
      res.send(users);
    } catch (error) {
      next(error);
    }
  });
