const UserSchema = require("../models/Users.model");
const bcrypt = require("bcrypt");
const { db } = require("../connectDatabase");
const jwt = require("jsonwebtoken");
const shortid = require("shortid");
const {
  ADMIN_ROLE,
  CLIENT_ROLE,
  STATION_ROLE,
  DRIVER_ROLE,
  ADMIN_PREFIX,
  CLIENT_PREFIX,
  DRIVER_PREFIX,
  STATION_PREFIX,
} = require("../constants/user.constant");

const StationSchema = require("../models/Station.model");
const ClientSchema = require("../models/Client.model");
const DriverSchema = require("../models/Driver.model");

const generateTypeId = (role, shortId) => {
  switch (role) {
    case ADMIN_ROLE:
      return ADMIN_PREFIX + shortId;
    case CLIENT_ROLE:
      return CLIENT_PREFIX + shortId;
    case STATION_ROLE:
      return DRIVER_PREFIX + shortId;
    case DRIVER_ROLE:
      return STATION_PREFIX + shortId;
  }
};

const signUp = async (req, res) => {
  //validate
  const { error } = UserSchema.validate(req.body);
  const { username, password, role } = req.body;
  if (error) {
    return res.status(400).send(error.message);
  }
  // hashing password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // check user has exist

  // save to db
  // create typeId
  const id = shortid.generate();
  const typeId = generateTypeId(role, id);
  const newUser = await db.collection("users").add({
    username,
    hashedPassword,
    role,
    typeId,
  });
  if (newUser) {
    return res.status(200).json({
      userId: newUser.id,
      message: "User written",
    });
  }
};

const signIn = async (req, res) => {
  const { username, password } = req.body;
  const querySnapshot = await db
    .collection("users")
    .where("username", "==", username)
    .get();
  for (const doc of querySnapshot.docs) {
    if (doc.exists) {
      // check password
      const user = doc.data();
      const isCorrect = await bcrypt.compare(password, user.hashedPassword);
      if (isCorrect) {
        // generate token
        const payload = {
          username: user.username,
          role: user.role,
        };
        const token = jwt.sign(payload, process.env.PRIVATE_KEY, {
          expiresIn: "2h",
        });

        // save token to session
        req.session.User = {
          token: token,
          role: user.role,
        };

        // send token
        return res.status(200).end(token);
      } else {
        return res.status(400).end("Username or password invalid!");
      }
    }
  }
  return res.status(400).end("User has not exist");
};

const validate = async (data, schema) => {
  const { error } = await schema.validate(data);
  return error;
};

const updateUserInfo = async (userId, data) => {
  await db.collection("users").doc(userId.trim()).update(data);
};

const updateInfo = async (req, res) => {
  const { userId } = req.params;
  // get user
  const user = await db.collection("users").doc(userId.trim()).get();
  if (!user.exists) {
    return res.status(400).send({
      message: "Something wrong",
    });
  }
  const { role } = user.data();
  switch (role) {
    case ADMIN_ROLE:
      break;
    case CLIENT_ROLE:
      // validate
      const clientError = await validate(req.body, ClientSchema);
      if (clientError) {
        return res.status(400).json({
          message: clientError.message,
        });
      }
      await updateUserInfo(userId, req.body);
      return res.status(200).json({
        message: "Updated",
      });
    case STATION_ROLE:
      // validate
      const stationError = await validate(req.body, StationSchema);
      if (stationError) {
        return res.status(400).json({
          message: stationError.message,
        });
      }
      await updateUserInfo(userId, req.body);
      return res.status(200).json({
        message: "Updated",
      });
    case DRIVER_ROLE:
      // validate
      const driverError = await validate(req.body, DriverSchema);
      if (driverError) {
        return res.status(400).json({
          message: driverError.message,
        });
      }
      await updateUserInfo(userId, req.body);
      return res.status(200).json({
        message: "Updated",
      });
  }
};

module.exports = { signUp, signIn, updateInfo };
