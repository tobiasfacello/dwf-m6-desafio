import { firestoreDB, realtimeDB } from "./db";
import * as express from "express";
import { v4 as uuidv4 } from "uuid";
import * as path from "path";
import * as cors from "cors";
import * as bodyParser from "body-parser";

const port = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(bodyParser.json());

const usersDataRef = firestoreDB.collection("users");
const gameRoomsDataRef = firestoreDB.collection("gamerooms");

function makeRandomId(length) {
	let result = "";
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for (let i = 0; i < length; i++) {
		result += characters.charAt(
			Math.floor(Math.random() * characters.length)
		);
	}
	return result;
}

//? Devuelve un arreglo con los datos de los usuarios existentes.
app.get("/users", (req, res) => {
	usersDataRef.get().then((usersData) => {
		const docs = usersData.docs;
		const users = docs.map((doc) => {
			return doc.data();
		});
		res.status(200).send({
			...users,
		});
	});
});

//? Devuelve los datos de un usuario específico comprobando los datos de autenticación.
app.get("/users/:userId", (req, res) => {
	const userId = req.params.userId;
	const userDoc = usersDataRef.doc(`${userId}`);
	userDoc.get().then((snap) => {
		if (snap.id == userId) {
			const snapData = snap.data();
			if (snapData) {
				res.status(302).send({
					...snapData,
				});
			} else {
				res.status(401).send();
			}
		}
	});
});

//? Autentica un usuario (Registro y/o Inicio de sesión).
app.post("/users/auth", (req, res) => {
	const userName: string = req.body.userName;

	usersDataRef
		.where("userName", "==", userName) // Chequea si el nombre de usuario existe previamente.
		.get()
		.then((userData) => {
			if (userData.empty) {
				// De no existir el usuario, agrega uno nuevo a partir de los datos recuperados.
				usersDataRef
					.add({
						userName,
					})
					.then((newUserData) => {
						// Devuelve el identificador del nuevo usuario e informa que ha sido creado correctamente.
						res.status(201).send({
							id: newUserData.id,
						});
					});
			} else {
				// Si el usuario existe previamente, informa que fue encontrado.
				res.status(302).send();
			}
		});
});

//? Crea un nuevo gameroom en las bases de datos y agrega al jugador.
app.post("/gamerooms", (req, res) => {
	const secureId = uuidv4(); // Genera un ID de seguridad.
	const friendlyId = makeRandomId(5); // Genera un ID "amigable".

	const userId = req.body.userId;
	const userName = req.body.userName;

	// Crea un gameroom en Realtime usando como referencia el "secureId".
	const rtdbGameRoomRef = realtimeDB.ref(`/gamerooms/${secureId}`);
	const rtdbGameRoomId = rtdbGameRoomRef.key;

	// Setea la estructura para almacenar los datos del nuevo gameroom.
	rtdbGameRoomRef.set({
		playersData: {},
	});

	// Crea un gameroom en Firestore usando como referencia del documento el "friendlyId".
	const newGameRoom = gameRoomsDataRef.doc(`${friendlyId}`);

	// Setea la estructura para almacenar los datos importantes del nuevo gameroom.
	newGameRoom
		.set({
			rtdbGameRoomId,
		})
		.then(() => {
			{
				res.status(201).send({
					friendlyId,
					secureId: rtdbGameRoomId,
				});
			}
		});

	const gameRoomPlayerRef = realtimeDB.ref(
		`/gamerooms/${secureId}/playersData/${userId}`
	);

	gameRoomPlayerRef.set(
		{
			name: userName,
			choice: "",
			score: 0,
			status: "online",
		},
		(err) => {}
	);
});

//* Firestore
//? Devuelve la data de un gameroom específico.
app.get("/fsdb/gamerooms/:friendlyId", (req, res) => {
	const friendlyId: string = req.params.friendlyId; // Recupera el ID pasado como parámetro de la request.
	const gameRoomDoc = gameRoomsDataRef.doc(`${friendlyId}`); // Hace referencia al documento con el ID antes mencionado.

	gameRoomDoc.get().then((snap) => {
		// Si el documento con ID "friendlyId" existe...
		if (snap.exists) {
			// Captura la data del documento encontrado y la devuelve informando que la request se completó correctamente.
			const snapData = snap.data();
			res.status(302).send({
				...snapData,
			});
		} else {
			// Si el documento no existe, devuelve un mensaje informando que el documento no ha sido encontrado.
			res.status(404).send({
				message:
					"La sala no ha sido encontrada. Compruebe que el ID se ingresó correctamente de lo contrario cree una sala",
			});
		}
	});
});

//* Realtime
//? Devuelve la data de un gameroom específico.
app.get("/rtdb/gamerooms/:secureId", (req, res) => {
	const secureId: string = req.params.secureId;
	const gameRoomRef = realtimeDB.ref(`/gamerooms/${secureId}`);

	gameRoomRef.get().then((snap) => {
		const snapData = snap.val();
		if (snapData.currentGame.results !== "" || undefined) {
			res.status(200).send({
				...snapData,
			});
		} else {
			res.status(404).send({
				message:
					"La sala no ha sido encontrada o no tiene datos dentro.",
			});
		}
	});
});

//? Verifica que la sala de juego no está llena para permitir el ingreso.
app.get("/rtdb/gamerooms/:secureId/:userId", (req, res) => {
	const secureId: string = req.params.secureId;
	const userId: string = req.params.userId;

	const gameRoomPlayersRef = realtimeDB.ref(
		`/gamerooms/${secureId}/playersData`
	);

	gameRoomPlayersRef.get().then((snap) => {
		if (snap.exists) {
			const snapData = snap.val();
			const snapDataEntries =
				snapData !== null ? Object.entries(snapData) : [];

			if (
				snapDataEntries.length == 2 &&
				snapDataEntries.find((id) => id[0] == userId) == undefined
			) {
				res.status(401).send({
					mesasage:
						"La sala está llena. El usuario no pertenecía previamente a la misma.",
				});
			} else if (
				snapDataEntries.length == 2 &&
				snapDataEntries.find((id) => id[0] == userId) !== undefined
			) {
				res.status(302).send({
					message:
						"La sala está llena pero el usuario se encuentra autorizado. Autenticado exitosamente.",
				});
			} else if (
				snapDataEntries.length == 0 ||
				snapDataEntries.length < 2
			) {
				res.status(202).send({
					message: "Se verficó la disponibilidad de la sala.",
				});
			}
		}
	});
});

//? Autentica a un usuario para su posterior ingreso a la sala de juego.
app.post("/rtdb/gamerooms/:secureId/:userId", (req, res) => {
	const secureId: string = req.params.secureId;
	const userId: string = req.params.userId;
	const userName: string = req.body.userName;

	const gameRoomPlayerRef = realtimeDB.ref(
		`/gamerooms/${secureId}/playersData/${userId}`
	);

	gameRoomPlayerRef.set(
		{
			name: userName,
			choice: "",
			score: 0,
			status: "online",
		},
		(err) => {
			if (err) {
				res.status(401).send({
					message:
						"No fue autorizado el usuario para ingresar a la sala",
				});
			} else {
				res.status(202).send({
					message: "Se autenticó al usuario correctamente.",
				});
			}
		}
	);
});

//? Actualiza el estado del usuario.
app.patch("/rtdb/gamerooms/:secureId/:userId/status", (req, res) => {
	const secureId: string = req.params.secureId;
	const userId: string = req.params.userId;
	const userStatus: string = req.body.userStatus;

	const gameRoomPlayerRef = realtimeDB.ref(
		`/gamerooms/${secureId}/playersData/${userId}`
	);

	gameRoomPlayerRef.update({ status: `${userStatus}` }).then((data) => {
		res.status(202).send({
			message: `Estado de usuario actualizado: ${userStatus}`,
		});
	});
});

//? Actualiza la jugada del usuario.
app.patch("/rtdb/gamerooms/:secureId/:userId/choice", (req, res) => {
	const secureId: string = req.params.secureId;
	const userId: string = req.params.userId;
	const userChoice: string = req.body.userChoice;

	const gameRoomPlayerRef = realtimeDB.ref(
		`/gamerooms/${secureId}/playersData/${userId}`
	);

	gameRoomPlayerRef.update({ choice: `${userChoice}` }).then((data) => {
		res.status(202).send({
			message: `Elección de usuario actualizada: ${userChoice}`,
		});
	});
});

//? Actualiza el marcador del usuario.
app.patch("/rtdb/gamerooms/:secureId/:userId/score", (req, res) => {
	const secureId: string = req.params.secureId;
	const userId: string = req.params.userId;
	const userScore: string = req.body.userScore;

	const gameRoomPlayerRef = realtimeDB.ref(
		`/gamerooms/${secureId}/playersData/${userId}`
	);

	gameRoomPlayerRef.update({ score: `${userScore}` }).then((data) => {
		res.status(202).send({
			message: `Marcador de usuario actualizado: ${userScore}`,
		});
	});
});

app.use(express.static("dist"));

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "../dist/index.html"));
});

app.listen(port, () => {
	console.log("Server is running on port:", port);
});
