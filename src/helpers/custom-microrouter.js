const { send } = require('micro');
const { withNamespace, router, get, post, put, del } = require('microrouter');

const apiV1 = withNamespace('/api/v1');

const wrap = cb => (path, fn) => {
  const newFn = (req, res) => {
    res.send = (...args) => send(res, ...args);

    return fn(req, res);
  };

  return apiV1(cb(path, newFn));
};

module.exports = {
  router,
  get: wrap(get),
  post: wrap(post),
  put: wrap(put),
  del: wrap(del),
};
