const Joi = require("joi");
const { ACTIVE, INACTIVE } = require("../constants/contract.constanst");

const ContractSchema = Joi.object({
  clientId: Joi.string().required(),
  createdDate: Joi.date(),
  startDate: Joi.date().required(),
  endDate: Joi.date().required(),
  credit: Joi.number().required(),
  status: Joi.string().valid(ACTIVE, INACTIVE).required(),
});
module.exports = ContractSchema;
