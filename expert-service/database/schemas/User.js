const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
  name: {
    type: String,
    unique: false,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    unique: false,
    required: true,
    trim: false,
  },
  document: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  roles: {
    type: Object,
    unique: false,
    required: false,
    trim: false,
  },
  registrationOrigin: {
    type: String,
    unique: false,
    required: true,
    trim: true,
  },
  relationshipId: {
    type: String,
    unique: false,
    required: false,
    trim: true,
  },
});

// eslint-disable-next-line func-names
userSchema.pre('save', function (next) {
  const user = this;
  // eslint-disable-next-line consistent-return
  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) {
      return next(err);
    }
    user.password = hash;
    next();
  });
});

// eslint-disable-next-line func-names
userSchema.methods.getName = function () {
  return `This is a shared function: ${this.name}`;
};
module.exports = userSchema;
