require('dotenv').config();

const { NOT_FOUND } = require('http-status-codes');
const { router, get, post, put, del } = require('./helpers/custom-microrouter');
const cors = require('micro-cors')();

const topicController = require('./topic.controller');
const topicMiddleware = require('./topic.middleware');

const error404 = (req, res) => {
  res.send(NOT_FOUND, {
    code: NOT_FOUND,
    message: 'Not found',
  });
};

module.exports = router(
  get('/topics', cors(topicController.getList)),
  post('/topics', cors(topicMiddleware.validate(topicController.create))),
  get('/topics/:id', cors(topicController.getDetails)),
  put('/topics/:id', cors(topicMiddleware.validate(topicController.update))),
  del('/topics/:id', cors(topicController.remove)),

  // not found
  get('/*', error404),
);
