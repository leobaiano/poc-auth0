const { Router } = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = Router({ mergeParams: true })
  .post('/v1/getToken', async (req, res, next) => {
    try {
      await req.db.User.findOne({
        document: req.body.document,
      })
        .exec((error, user) => {
          if (error) {
            res.status(500).send({ message: error });
            return '';
          }

          if (!user) {
            return res.status(404).send({ message: 'User Not found.' });
          }

          const passwordIsValid = bcrypt.compareSync(
            req.body.password,
            user.password,
          );

          if (!passwordIsValid) {
            return res.status(401).send({
              access_token: null,
              message: 'Invalid Password!',
            });
          }

          // eslint-disable-next-line no-underscore-dangle
          const token = jwt.sign({ id: user._id, name: user.name, roles: user.roles },
            process.env.AUTH0_CLIENT_SECRET, { expiresIn: 86400 });

          return res.status(200).send({
            // eslint-disable-next-line no-underscore-dangle
            id: user._id,
            name: user.name,
            access_token: token,
          });
        });
    } catch (error) {
      next(error);
    }
  });
