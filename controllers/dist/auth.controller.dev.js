"use strict";

var UserSchema = require("../models/Users.model");

var bcrypt = require("bcrypt");

var _require = require("../connectDatabase"),
    db = _require.db;

var jwt = require("jsonwebtoken");

var shortid = require("shortid");

var _require2 = require("../constants/user.constant"),
    ADMIN_ROLE = _require2.ADMIN_ROLE,
    CLIENT_ROLE = _require2.CLIENT_ROLE,
    STATION_ROLE = _require2.STATION_ROLE,
    DRIVER_ROLE = _require2.DRIVER_ROLE,
    ADMIN_PREFIX = _require2.ADMIN_PREFIX,
    CLIENT_PREFIX = _require2.CLIENT_PREFIX,
    DRIVER_PREFIX = _require2.DRIVER_PREFIX,
    STATION_PREFIX = _require2.STATION_PREFIX;

var StationSchema = require("../models/Station.model");

var ClientSchema = require("../models/Client.model");

var DriverSchema = require("../models/Driver.model");

var generateTypeId = function generateTypeId(role, shortId) {
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

var signUp = function signUp(req, res) {
  var _UserSchema$validate, error, _req$body, username, password, role, salt, hashedPassword, id, typeId, newUser;

  return regeneratorRuntime.async(function signUp$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          //validate
          _UserSchema$validate = UserSchema.validate(req.body), error = _UserSchema$validate.error;
          _req$body = req.body, username = _req$body.username, password = _req$body.password, role = _req$body.role;

          if (!error) {
            _context.next = 4;
            break;
          }

          return _context.abrupt("return", res.status(400).send(error.message));

        case 4:
          _context.next = 6;
          return regeneratorRuntime.awrap(bcrypt.genSalt(10));

        case 6:
          salt = _context.sent;
          _context.next = 9;
          return regeneratorRuntime.awrap(bcrypt.hash(password, salt));

        case 9:
          hashedPassword = _context.sent;
          // check user has exist
          // save to db
          // create typeId
          id = shortid.generate();
          typeId = generateTypeId(role, id);
          _context.next = 14;
          return regeneratorRuntime.awrap(db.collection("users").add({
            username: username,
            hashedPassword: hashedPassword,
            role: role,
            typeId: typeId
          }));

        case 14:
          newUser = _context.sent;

          if (!newUser) {
            _context.next = 17;
            break;
          }

          return _context.abrupt("return", res.status(200).json({
            userId: newUser.id,
            message: "User written"
          }));

        case 17:
        case "end":
          return _context.stop();
      }
    }
  });
};

var signIn = function signIn(req, res) {
  var _req$body2, username, password, querySnapshot, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, doc, user, isCorrect, payload, token;

  return regeneratorRuntime.async(function signIn$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body2 = req.body, username = _req$body2.username, password = _req$body2.password;
          _context2.next = 3;
          return regeneratorRuntime.awrap(db.collection("users").where("username", "==", username).get());

        case 3:
          querySnapshot = _context2.sent;
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context2.prev = 7;
          _iterator = querySnapshot.docs[Symbol.iterator]();

        case 9:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context2.next = 27;
            break;
          }

          doc = _step.value;

          if (!doc.exists) {
            _context2.next = 24;
            break;
          }

          // check password
          user = doc.data();
          _context2.next = 15;
          return regeneratorRuntime.awrap(bcrypt.compare(password, user.hashedPassword));

        case 15:
          isCorrect = _context2.sent;

          if (!isCorrect) {
            _context2.next = 23;
            break;
          }

          // generate token
          payload = {
            username: user.username,
            hashedPassword: username.hashedPassword
          };
          token = jwt.sign(payload, process.env.PRIVATE_KEY, {
            expiresIn: "2h"
          }); // save token to session

          req.session.User = {
            token: token
          }; // send token

          return _context2.abrupt("return", res.status(200).end(token));

        case 23:
          return _context2.abrupt("return", res.status(400).end("Username or password invalid!"));

        case 24:
          _iteratorNormalCompletion = true;
          _context2.next = 9;
          break;

        case 27:
          _context2.next = 33;
          break;

        case 29:
          _context2.prev = 29;
          _context2.t0 = _context2["catch"](7);
          _didIteratorError = true;
          _iteratorError = _context2.t0;

        case 33:
          _context2.prev = 33;
          _context2.prev = 34;

          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }

        case 36:
          _context2.prev = 36;

          if (!_didIteratorError) {
            _context2.next = 39;
            break;
          }

          throw _iteratorError;

        case 39:
          return _context2.finish(36);

        case 40:
          return _context2.finish(33);

        case 41:
          return _context2.abrupt("return", res.status(400).end("User has not exist"));

        case 42:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[7, 29, 33, 41], [34,, 36, 40]]);
};

var validate = function validate(data, schema) {
  var _ref, error;

  return regeneratorRuntime.async(function validate$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(schema.validate(data));

        case 2:
          _ref = _context3.sent;
          error = _ref.error;
          return _context3.abrupt("return", error);

        case 5:
        case "end":
          return _context3.stop();
      }
    }
  });
};

var updateUserInfo = function updateUserInfo(userId, data) {
  return regeneratorRuntime.async(function updateUserInfo$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(db.collection("users").doc(userId).update(data));

        case 2:
        case "end":
          return _context4.stop();
      }
    }
  });
};

var updateInfo = function updateInfo(req, res) {
  var userId, user, _user$data, role, clientError, stationError, driverError;

  return regeneratorRuntime.async(function updateInfo$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          userId = req.params.userId; // get user

          _context5.next = 3;
          return regeneratorRuntime.awrap(db.collection("users").doc(userId).get());

        case 3:
          user = _context5.sent;

          if (user.exists) {
            _context5.next = 6;
            break;
          }

          return _context5.abrupt("return", res.status(400).send({
            message: "Something wrong"
          }));

        case 6:
          _user$data = user.data(), role = _user$data.role;
          _context5.t0 = role;
          _context5.next = _context5.t0 === ADMIN_ROLE ? 10 : _context5.t0 === CLIENT_ROLE ? 11 : _context5.t0 === STATION_ROLE ? 19 : _context5.t0 === DRIVER_ROLE ? 27 : 35;
          break;

        case 10:
          return _context5.abrupt("break", 35);

        case 11:
          _context5.next = 13;
          return regeneratorRuntime.awrap(validate(req.body, ClientSchema));

        case 13:
          clientError = _context5.sent;

          if (!clientError) {
            _context5.next = 16;
            break;
          }

          return _context5.abrupt("return", res.status(400).json({
            message: clientError.message
          }));

        case 16:
          _context5.next = 18;
          return regeneratorRuntime.awrap(updateUserInfo(userId, req.body));

        case 18:
          return _context5.abrupt("return", res.status(200).json({
            message: "Updated"
          }));

        case 19:
          _context5.next = 21;
          return regeneratorRuntime.awrap(validate(req.body, StationSchema));

        case 21:
          stationError = _context5.sent;

          if (!stationError) {
            _context5.next = 24;
            break;
          }

          return _context5.abrupt("return", res.status(400).json({
            message: stationError.message
          }));

        case 24:
          _context5.next = 26;
          return regeneratorRuntime.awrap(updateUserInfo(userId, req.body));

        case 26:
          return _context5.abrupt("return", res.status(200).json({
            message: "Updated"
          }));

        case 27:
          _context5.next = 29;
          return regeneratorRuntime.awrap(validate(req.body, DriverSchema));

        case 29:
          driverError = _context5.sent;

          if (!driverError) {
            _context5.next = 32;
            break;
          }

          return _context5.abrupt("return", res.status(400).json({
            message: driverError.message
          }));

        case 32:
          _context5.next = 34;
          return regeneratorRuntime.awrap(updateUserInfo(userId, req.body));

        case 34:
          return _context5.abrupt("return", res.status(200).json({
            message: "Updated"
          }));

        case 35:
        case "end":
          return _context5.stop();
      }
    }
  });
};

module.exports = {
  signUp: signUp,
  signIn: signIn,
  updateInfo: updateInfo
};