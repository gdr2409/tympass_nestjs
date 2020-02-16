const admin = require('firebase-admin');
const serviceAccount = require('../firestore-security-key');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export const configDB = admin.firestore();