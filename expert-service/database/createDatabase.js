const mongoose = require('mongoose');
const glob = require('glob');
const path = require('path');

module.exports = ({ logger }) => {
  const url = 'mongodb://127.0.0.1:27017/poc-expert';
  mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
  const db = glob.sync('./schemas/**/*.js', { cwd: __dirname })
    .map((filename) => ({
      // eslint-disable-next-line global-require, import/no-dynamic-require
      schema: require(filename),
      name: path
        .basename(filename)
        .replace(path.extname(filename), ''),
    }))
    .map(({ name, schema }) => mongoose.model(name, schema))
    // eslint-disable-next-line no-shadow
    .reduce((db, model) => ({
      ...db,
      [model.modelName]: model,
    }), {});
  mongoose
    .connection
    .on('error', (error) => {
      throw error;
    })
    .once('open', () => logger.info(`MongoDB connected at ${url}`));
  return db;
};
