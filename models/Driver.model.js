const Joi = require("joi");

const DriverSchema = Joi.object({
  fullName: Joi.string().required(),
  avatar: Joi.any(),
  phone: Joi.string(),
  stock: Joi.number().integer().positive(),
  remain: Joi.number().integer().positive(),
  maxPerTransaction: Joi.number().integer().positive(),
  Plate: Joi.string(),
});

module.exports = DriverSchema;
