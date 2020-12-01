var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://petrolimex-3680f.firebaseio.com",
});

const db = admin.firestore();

const firebase = admin;

module.exports = { db, firebase };
