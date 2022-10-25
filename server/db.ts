import * as admin from "firebase-admin";
import * as firebaseKey from "../key.json";

const app = admin.initializeApp({
	credential: admin.credential.cert(firebaseKey as any),
	databaseURL: process.env.DB_URL,
});

const firestoreDB = admin.firestore();
const realtimeDB = admin.database();

export { firestoreDB, realtimeDB };
