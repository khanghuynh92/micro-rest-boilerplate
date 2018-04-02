const Mongoose = require('./db/mongoose.js');
const Schema = Mongoose.Schema;
const topicSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
});

topicSchema.method({
  securedInfo() {
    const { _id, title, slug, description } = this;

    return {
      id: _id,
      title,
      slug,
      description,
    };
  },
});

topicSchema.statics = {
  getOne({ select = '', query = {}, populate = '' }) {
    return this.findOne(query)
    .select(select)
    .populate(populate);
  },
  list({ query = {}, skip = 0, sort = '-created.at', limit = 0, select = '', populate = '' }) {
    return this.find(query || {})
    .sort(sort)
    .select(select)
    .skip(skip)
    .limit(limit)
    .populate(populate);
  },
  countAll({ query = {} }) {
    return this.count(query || {})
  },
};

const initColl = () => {
  if (Mongoose.models.Topic) {
    return Mongoose.model('Topic');
  } else {
    return Mongoose.model('Topic', topicSchema);
  }
};

module.exports = initColl();
