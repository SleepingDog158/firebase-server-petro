require("dotenv").config();
const express = require("express");
const app = express();
const port = 8080;
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");

const sessionExpireTime = 1000 * 60 * 60 * 2; // 2h

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: sessionExpireTime },
  })
);

// routers
const UserRoute = require("./routes/auth.route");
const AdminRoute = require("./routes/admin.route");
const ClientRoute = require("./routes/client.route");
const StationRoute = require("./routes/station.route");

// middlewares

const authMiddleware = require("./middlewares/auth.middleware");

app.get("/", (req, res) => {
  res.send("helllo");
});

app.use("/auth", UserRoute);
app.use("/admin", authMiddleware.requireAuth, AdminRoute);
app.use("/client", authMiddleware.requireAuth, ClientRoute);
app.use("/station", authMiddleware.requireAuth, StationRoute);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
