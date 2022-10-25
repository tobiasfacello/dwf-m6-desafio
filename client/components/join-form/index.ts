import { Router } from "@vaadin/router";
import { state } from "../../state";

class JoinFormComponent extends HTMLElement {
	shadow = this.attachShadow({ mode: "open" });
	constructor() {
		super();

		let style = document.createElement("style");
		style.textContent = `
        .join-form {
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        
        .input-container {
            width: 300px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            margin-top: 20px;
        }

		@media (min-width: 768px) {
			.input-container {
				width: 100%;
			}
		}

        .input__label {
            width: 100%;
            justify-self: flex-start;
            margin-bottom: 5px;
			font-family: "Raleway", sans-serif;
			font-weight: 400;
			font-size: 12px;
            color: #EEEEEE;
        }

        .input__field {
            width: 100%;
			height: 50px;
			padding: 0;
			font-family: "Raleway", sans-serif;
			font-weight: 500;
			font-size: 15px;
			text-align: center;
			border: none;
			border-radius: 5px;
            background-color: rgba(0, 0, 0, 0.3);
			color: #EEE;
        }

		@media (min-width: 768px) {
			.input__field {
				width: 380px;
			}
		}
		
        .input__field:focus {
			background-color: transparent;
            outline: 1px solid #FFFFFF;
			text-shadow: 0px 0px 2px #fff;
        }
		
		.input__field:focus::placeholder {
			font-family: "Raleway", sans-serif;
			font-weight: 500;
			font-size: 15px;
			text-shadow: 0px 0px 5px #fff;
			color: #EEE;
		}

		.confirmation-container {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            margin-top: 25px;
        }

        .notification {
            opacity: 0;
        }
		`;

		this.render();
		this.shadow.appendChild(style);
		this.addListeners();
	}

	render() {
		this.shadow.innerHTML = `
            <notification-comp class="notification wrong-input" errorNotification notificationTitle="Falló el ingreso a la sala">
            Ingrese los datos requeridos correctamente para efectuar el ingreso.
            </notification-comp>
            <notification-comp class="notification full-room" errorNotification notificationTitle="Sala de juego llena">
            Por favor, cree una nueva sala o ingrese con el identificador de otra.
            </notification-comp>
			<notification-comp class="notification process" warnNotification notificationTitle="Aguarde un momento">
            Se estan verificando los datos...
            </notification-comp>
            
            <form action="submit" class="join-form">
                <div class="input-container">
                    <label class="input__label" for="gameroom">Ingresar a sala</label>
                    <input id="gameroom" name="gameroom" class="input__field" type="text" placeholder="ID de sala existente" value="${this.textContent}" required>
                </div>
                <div class="confirmation-container">
                    <btn-comp class="submit-button" darkBtn>Continuar</btn-comp>
                </div>
            </form>
        `;
	}

	addListeners() {
		const joinFormEl: HTMLFormElement =
			this.shadow.querySelector(".join-form");

		const inputFieldEl: HTMLInputElement =
			this.shadow.querySelector(".input__field");

		const submitBtnEl: HTMLButtonElement =
			this.shadow.querySelector(".submit-button")!;

		const wrongInputNotifEl: HTMLElement =
			this.shadow.querySelector(".wrong-input");

		const fullRoomNotifEl: HTMLElement =
			this.shadow.querySelector(".full-room");

		const processNotifEl: HTMLElement =
			this.shadow.querySelector(".process")!;

		function showNotification(el: HTMLElement) {
			el.style.opacity = "1";
			setTimeout(() => {
				el.style.opacity = "0";
			}, 6000);
		}

		function hideNotification(el: HTMLElement) {
			el.style.opacity = "0";
		}

		wrongInputNotifEl.addEventListener("click", () => {
			hideNotification(wrongInputNotifEl);
		});

		fullRoomNotifEl.addEventListener("click", () => {
			hideNotification(fullRoomNotifEl);
		});

		processNotifEl.addEventListener("click", () => {
			hideNotification(processNotifEl);
		});

		inputFieldEl.addEventListener("invalid", () => {
			showNotification(wrongInputNotifEl);
		});

		submitBtnEl.addEventListener("click", (e) => {
			e.preventDefault();
			joinFormEl.requestSubmit();
		});

		joinFormEl.addEventListener("submit", (e) => {
			const target = e.target as HTMLFormElement;
			e.preventDefault();

			const friendlyId: string = target.gameroom.value;

			const joinRoomPromise = state.getFirestoreGameRoom(friendlyId);

			joinRoomPromise.then((res) => {
				if (res.status == 302) {
					showNotification(processNotifEl);
					const roomDataPromise = res.response.then((data) => {
						return data;
					});

					roomDataPromise.then((roomData) => {
						const secureId = roomData.rtdbGameRoomId;
						const userAuthId: string =
							state.getUserAuthData().userId;
						const userData = state.pullUserData(userAuthId);

						userData
							.then((res) => {
								return res.response;
							})
							.then((user) => {
								const checkRoomPlayersPromise =
									state.checkRoomPlayersData(
										secureId,
										userAuthId
									);

								checkRoomPlayersPromise.then((res) => {
									if (res.status == 401) {
										hideNotification(processNotifEl);
										showNotification(fullRoomNotifEl);
									} else if (res.status == 302) {
										state.setRoomAccessData(
											friendlyId,
											secureId
										);

										const updateStatusPromise =
											state.updatePlayerStatus(
												secureId,
												userAuthId,
												"online"
											);

										updateStatusPromise.then(() => {
											Router.go("/gameroom/instructions");
										});
									} else if (res.status == 202) {
										state.setRoomPlayersData(
											secureId,
											userAuthId,
											user.userName
										);
										state;
										const updateStatusPromise =
											state.updatePlayerStatus(
												secureId,
												userAuthId,
												"online"
											);

										updateStatusPromise.then(() => {
											Router.go("/gameroom/instructions");
										});
									}
								});
							});
					});
				} else if (res.status == 404) {
					wrongInputNotifEl.style.opacity = "1";
					setTimeout(() => {
						wrongInputNotifEl.style.opacity = "0";
					}, 6000);
				}
			});
		});
	}
}

customElements.define("join-form", JoinFormComponent);
