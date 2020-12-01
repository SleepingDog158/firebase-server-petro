const Joi = require("joi");

const ClientSchema = Joi.object({
  clientName: Joi.string().required(),
  clientAddress: Joi.string().required(),
  taxId: Joi.string()
    .length(6)
    .pattern(/^[0-9]+$/)
    .required(),
  creditLimit: Joi.number().integer().required(),
});
module.exports = ClientSchema;
