import { realtimeDBClient } from "./db";
import { Router } from "@vaadin/router";
const API_BASE_URL = "http://localhost:3000";

//? Se declara el tipo "Jugada" para limitar el valor de los datos.
type Jugada = "piedra" | "papel" | "tijeras";

const state = {
	data: {
		userAuthData: {
			userId: "",
			userName: "",
		},
		locationAfterAuth: {
			userSelection: "",
		},
		rtdbIsConnected: {
			statusChecked: false,
		},
		bothPlayersPlayed: {
			choicesChecked: false,
		},
		//? Es la jugada que se está procesando en el momento de la partida.
		currentGameRoom: {
			accessData: {
				friendlyId: "",
				secureId: "",
			},
			playersData: {},
		},
		//? Es el historial de jugadas registradas entre usuario y computadora.
		history: {
			result: "",
		},
	},
	listeners: [],

	initLocalStorage() {
		//? Recupera la data almacenada en localStorage.
		const localData = JSON.parse(localStorage.getItem("state-cache")!);
		//? Si no se encuentran data, frena el proceso.
		if (!localData) {
			return;
		} else {
			//? Si encuentra data, sobreescribe la data del state.
			this.setState(localData);
		}
	},

	initGameRoom(secureId) {
		const chatRoomsRef = realtimeDBClient.ref(`/gamerooms/${secureId}`);
		chatRoomsRef.on("value", (snap) => {
			const currentState = this.getState();
			const snapData = snap.val();
			currentState.currentGameRoom.playersData = snapData.playersData;
			this.setState(currentState);
		});
	},

	getPlayersStatus(secureId) {
		const chatRoomsRef = realtimeDBClient.ref(`/gamerooms/${secureId}`);
		chatRoomsRef.on("value", (snap) => {
			const snapData = snap.val();
			const playersData = snapData.playersData;
			const playersDataArr = Object.entries(playersData);
			const statusArr = playersDataArr.map((player) => {
				return player[1]["status"];
			});

			if (
				(statusArr[0] == "ready" &&
					statusArr[1] !== "ready" &&
					location.pathname !== "/gameroom/timeout" &&
					location.pathname !== "/home" &&
					location.pathname !== "/gameroom/results") ||
				(statusArr[1] == "ready" &&
					statusArr[0] !== "ready" &&
					location.pathname !== "/gameroom/timeout" &&
					location.pathname !== "/home" &&
					location.pathname !== "/gameroom/results")
			) {
				this.checkRealtimeConnection() == false
					? this.setRealtimeConnection(true)
					: "";

				Router.go("/gameroom/waitroom");
			} else if (
				statusArr[0] == "ready" &&
				statusArr[1] == "ready" &&
				location.pathname !== "/gameroom/timeout"
			) {
				this.checkRealtimeConnection() == false
					? this.setRealtimeConnection(true)
					: "";

				Router.go("/gameroom/play");
			}
		});
	},

	getPlayersChoices(secureId) {
		const chatRoomsRef = realtimeDBClient.ref(`/gamerooms/${secureId}`);
		chatRoomsRef.get().then((snap) => {
			const snapData = snap.val();
			const playersData = snapData.playersData;
			const playersDataArr = Object.entries(playersData);
			const choicesArr = playersDataArr.map((player) => {
				return player[1]["choice"];
			});

			if (choicesArr[0] !== "" && choicesArr[1] !== "") {
				if (this.checkPlayersSelections() == false) {
					const currentState = this.getState();
					const userAuthId = currentState.userAuthData.userId;

					const actualChoicesArr = playersDataArr.map(
						(player: {}) => {
							if (player[0] == userAuthId) {
								const userPlay = player[1].choice;
								return userPlay;
							} else {
								const oponentPlay = player[1].choice;
								return oponentPlay;
							}
						}
					);
					this.setPlayersSelections(true);
					console.log(actualChoicesArr);
				} else {
					return;
				}
			}
		});
	},

	setRealtimeConnection(boolean) {
		const currentState = this.getState();
		currentState.rtdbIsConnected.statusChecked = boolean;
		this.setState(currentState);
	},

	checkRealtimeConnection() {
		const currentState = this.getState();
		const connectedChecks = currentState.rtdbIsConnected.statusChecked;
		return connectedChecks;
	},

	setPlayersSelections(boolean) {
		const currentState = this.getState();
		currentState.bothPlayersPlayed.choicesChecked = boolean;
		this.setState(currentState);
	},

	checkPlayersSelections() {
		const currentState = this.getState();
		const choicesChecks = currentState.bothPlayersPlayed.choicesChecked;
		return choicesChecks;
	},

	getState() {
		return this.data;
	},

	setState(newState: any) {
		this.data = newState; //? Sobreescribe la data.
		for (const callback of this.listeners) {
			callback(); //? Ejecuta los listeners suscritos a los cambios en el state.
		}
		//? Almacena en localStorage una copia de los datos actualizados.
		localStorage.setItem("state-cache", JSON.stringify(newState));
	},

	setRoomAccessData(friendlyId: string, secureId: string) {
		const currentState = this.getState();
		currentState.currentGameRoom.accessData.friendlyId = friendlyId;
		currentState.currentGameRoom.accessData.secureId = secureId;
		this.setState(currentState);
	},

	getRoomAccessData() {
		const currentState = this.getState();
		const friendlyId = currentState.currentGameRoom.accessData.friendlyId;
		const secureId = currentState.currentGameRoom.accessData.secureId;
		return { friendlyId, secureId };
	},

	setUserAuthData(id: string, name: string) {
		const currentState = this.getState();
		currentState.userAuthData.userId = id;
		currentState.userAuthData.userName = name;
		this.setState(currentState);
	},

	getUserAuthData() {
		const currentState = this.getState();
		const userId = currentState.userAuthData.userId;
		const userName = currentState.userAuthData.userName;
		return { userId, userName };
	},

	getUserName(userId: string) {
		const currentState = this.getState();
		const userName = currentState.currentGameRoom.playersData[userId].name;
		return userName;
	},

	getUserStatus(userId: string) {
		const currentState = this.getState();
		const userStatus =
			currentState.currentGameRoom.playersData[userId].status;
		return userStatus;
	},

	getUserChoice(userId: string) {
		const currentState = this.getState();
		const userChoice =
			currentState.currentGameRoom.playersData[userId].choice;
		return userChoice;
	},

	setLocationAfterAuth(location: string) {
		const currentState = this.getState();
		currentState.locationAfterAuth = location;
		this.setState(currentState);
	},

	getLocationAfterAuth() {
		const currentState = this.getState();
		const path = currentState.locationAfterAuth;
		return path;
	},

	//? Dependiendo del resultado, el helper indica si ganó el usuario o la computadora.
	whoWins(userPlay: Jugada, oponentPlay: Jugada) {
		const currentState = this.getState();
		const secureId: string =
			currentState.currentGameRoom.accessData.secureId;
		const userAuthId: string = currentState.userAuthData.userId;
		const userScore: number =
			currentState.currentGameRoom.playersData[userAuthId].score;

		if (
			(userPlay == "piedra" && oponentPlay == "tijeras") ||
			(userPlay == "tijeras" && oponentPlay == "papel") ||
			(userPlay == "papel" && oponentPlay == "piedra")
		) {
			currentState.history.result = "Ganaste!";
			this.updatePlayerScore(secureId, userAuthId, Number(userScore) + 1);
		} else if (userPlay == oponentPlay) {
			currentState.history.result = "Empate";
		} else {
			currentState.history.result = "Perdiste";
		}
	},

	//? Recibe la función callback que luego va a ser ejecutada cuando el state sea actualizado.
	subscribe(callback: (any) => any) {
		this.listeners.push(callback);
	},

	async createGameRoom(userId: string, userName: string) {
		const res = await fetch(`${API_BASE_URL}/gamerooms`, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ userId, userName }),
		});
		return { response: res.json(), status: res.status };
	},

	async sendAuthData(userName: string) {
		const res = await fetch(`${API_BASE_URL}/users/auth`, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify({ userName }),
		});
		return { response: res.json(), status: res.status };
	},

	async pullUserData(userId: string) {
		const res = await fetch(`${API_BASE_URL}/users/${userId}`, {
			method: "GET",
		});
		return { response: res.json(), status: res.status };
	},

	async getFirestoreGameRoom(friendlyId: string) {
		const res = await fetch(
			`${API_BASE_URL}/fsdb/gamerooms/${friendlyId}`,
			{
				method: "GET",
			}
		);
		return { response: res.json(), status: res.status };
	},

	async getRealtimeGameRoom(secureId: string) {
		const res = await fetch(`${API_BASE_URL}/rtdb/gamerooms/${secureId}`, {
			method: "GET",
		});
		return { response: res.json(), status: res.status };
	},

	async checkRoomPlayersData(secureId: string, userId: string) {
		const res = await fetch(
			`${API_BASE_URL}/rtdb/gamerooms/${secureId}/${userId}`,
			{
				method: "GET",
			}
		);
		return { response: res.json(), status: res.status };
	},

	async setRoomPlayersData(
		secureId: string,
		userId: string,
		userName: string
	) {
		const res = await fetch(
			`${API_BASE_URL}/rtdb/gamerooms/${secureId}/${userId}`,
			{
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({ userName }),
			}
		);
		return { response: res.json(), status: res.status };
	},

	async updatePlayerStatus(
		secureId: string,
		userId: string,
		userStatus: string
	) {
		const res = await fetch(
			`${API_BASE_URL}/rtdb/gamerooms/${secureId}/${userId}/status`,
			{
				method: "PATCH",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({ userStatus }),
			}
		);
		return { response: res.json(), status: res.status };
	},

	async updatePlayerChoice(
		secureId: string,
		userId: string,
		userChoice: string
	) {
		await fetch(
			`${API_BASE_URL}/rtdb/gamerooms/${secureId}/${userId}/choice`,
			{
				method: "PATCH",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({ userChoice }),
			}
		);
	},

	async updatePlayerScore(
		secureId: string,
		userId: string,
		userScore: number
	) {
		await fetch(
			`${API_BASE_URL}/rtdb/gamerooms/${secureId}/${userId}/score`,
			{
				method: "PATCH",
				headers: { "content-type": "application/json" },
				body: JSON.stringify({ userScore }),
			}
		);
	},
};

export { state, Jugada };
