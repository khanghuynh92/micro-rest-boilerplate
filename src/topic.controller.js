const { NOT_FOUND, INTERNAL_SERVER_ERROR, OK } = require('http-status-codes');
const { json } = require('micro');

const arrayDiff = require('./helpers/array-diff');
const Topic = require('./topic.model');

const BLACK_LIST = ['isDeleted'];

const getList = async (req, res) => {
  const select = req.query.select
    ? arrayDiff(req.query.select.split(','), BLACK_LIST).join(' ')
    : 'title slug description';
  const limit = req.query.limit ? +req.query.limit : 25;
  const {
    page = 0,
    skip = page && page > 0 ? (page - 1) * limit : 0,
    search,
    sort = '-created.at',
  } = req.query;

  const query = {
    isDeleted: false,
  };

  if (search) {
    const q = `%${search}%`;
    query.$or = [{
      title: {
        $like: q,
      },
    }];
  }

  const populate = [];

  const [ results, total ] = await Promise.all(
    [ Topic.list({
      select,
      limit,
      skip,
      sort,
      query,
      populate,
    }), Topic.countAll({
      query
    }) ]);

  const data = {
    meta: {
      total,
      limit,
      page: +page,
    },
    results,
  }

  res.send(OK, data);
};

const getDetails = async (req, res) => {
  const { id: _id } = req.params;
  const query = {
    _id,
    isDeleted: false,
  };

  const topic = await Topic.getOne({
    query,
  });

  if (!topic) {
    return res.send(NOT_FOUND, {
      code: NOT_FOUND,
      message: 'topic not found',
    });
  }

  return res.send(OK, topic);
};

const create = async (req, res) => {
  const { title, slug, description, logo, parent } = await json(req);
  try {
    const topic = new Topic({
      title,
      slug,
      description,
    });

    await topic.createByUser(req.user);

    res.send(OK, topic.securedInfo());
  } catch (err) {
    res.send(INTERNAL_SERVER_ERROR, {
      code: INTERNAL_SERVER_ERROR,
      message: 'Create topic failed!',
    });
  }
};

const update = async (req, res) => {
  const { id: _id } = req.params;
  const { title, slug, description, logo, parent } = await json(req);

  const topic = await Topic.findOne({
    _id,
    isDeleted: false,
  }).exec();

  if (!topic) {
    return res.send(NOT_FOUND, {
      code: NOT_FOUND,
      message: 'topic not found',
    });
  }

  try {
    await topic.extend({
      title,
      slug,
      description,
      logo,
      parent,
    }).updateByUser(req.user);
  } catch (err) {
    return res.send(INTERNAL_SERVER_ERROR, {
      code: INTERNAL_SERVER_ERROR,
      message: 'can not update topic',
    });
  }

  return res.send(OK, topic);
};

const remove = async (req, res) => {
  const { id: _id } = req.params;

  const topic = await Topic.findOne({
    _id,
    isDeleted: false,
  }).exec();

  if (!topic) {
    return res.send(NOT_FOUND, {
      code: NOT_FOUND,
      message: 'topic not found',
    });
  }

  try {
    await topic.extend({
      isDeleted: true,
    }).updateByUser(req.user);
  } catch (err) {
    return res.send(INTERNAL_SERVER_ERROR, {
      code: INTERNAL_SERVER_ERROR,
      message: 'can not delete topic',
    });
  }

  return res.send(OK, topic);
};

module.exports = {
  getList,
  getDetails,
  create,
  update,
  remove,
};
