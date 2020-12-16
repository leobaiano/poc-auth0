const { Router } = require('express');
const authJwt = require('../../../../utils/auth');

module.exports = Router({ mergeParams: true })
  .post('/v1/users', authJwt.verifyToken, async (req, res, next) => {
    try {
      const user = new req.db.User({
        name: req.body.name,
        password: req.body.password,
        document: req.body.document,
        roles: req.body.roles ? req.body.roles : [],
        registrationOrigin: req.body.registrationOrigin ? req.body.registrationOrigin : 'portal-expert',
        relationshipId: req.body.relationshipId,
      });

      await user.save();
      const location = `${req.base}${req.originalUrl}/${user.id}`;
      res.setHeader('Location', location);
      res.status(201).send(user);
    } catch (error) {
      next(error);
    }
  });
