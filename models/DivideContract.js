const Joi = require("joi");

// drivers: [
//   {
//     driverId,
//     limit,
//     remain,
//     maxTransaction
//   }
// ]

const DivideContractSchema = Joi.object({ 
  driverId: Joi.string().required(),
  limit: Joi.number().required(),
  remain: Joi.number().required(),
  maxTransaction: Joi.number().required(),
});
module.exports = DivideContractSchema;
