const Joi = require("joi");
const {
  ADMIN_ROLE,
  CLIENT_ROLE,
  DRIVER_ROLE,
  STATION_ROLE,
} = require("../constants/user.constant");

const UserSchema = Joi.object({
  username: Joi.string().min(6).max(100).required(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{8,24}$")).required(),
  role: Joi.string()
    .valid(ADMIN_ROLE, CLIENT_ROLE, DRIVER_ROLE, STATION_ROLE)
    .required(),
});

module.exports = UserSchema;
