const admin = require('firebase-admin');
const serviceAccount = require('./firebase-service-account.json'); // Download from Firebase Console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://petcarenew-16b82-default-rtdb.firebaseio.com/petcare.json"
});

const db = admin.firestore();

module.exports = { db };
