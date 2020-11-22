const Joi = require("joi");

const StationSchema = Joi.object({
  stationName: Joi.string().required(),
  stationAddress: Joi.string().required(),
  location: Joi.string(),
  startTime: Joi.string(),
  endTime: Joi.string(),
});

module.exports = StationSchema;
