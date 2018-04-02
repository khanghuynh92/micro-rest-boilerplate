const Joi = require('joi');
const Validation = require('micro-joi');

const validate = Validation(Joi.object({
  title: Joi.string().required(),
  slug: Joi.string().required(),
  description: Joi.string(),
}));

module.exports = {
  validate,
};
