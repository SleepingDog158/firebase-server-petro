const Joi = require("joi");
const { ACTIVE, INACTIVE } = require("../constants/contract.constanst");

const DriverSchema = Joi.object({
  fullName: Joi.string().required(),
  avatar: Joi.any(),
  phone: Joi.string(),
  stock: Joi.number().integer().positive(),
  remain: Joi.number().integer().positive(),
  maxPerTransaction: Joi.number().integer().positive(),
  Plate: Joi.string(),
  clientId: Joi.string().required(),
  status: Joi.string().valid(ACTIVE, INACTIVE).required(),
});

module.exports = DriverSchema;
