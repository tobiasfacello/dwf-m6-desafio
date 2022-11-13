import { state } from "../../state";
import { Router } from "@vaadin/router";

class AuthFormComponent extends HTMLElement {
	shadow = this.attachShadow({ mode: "open" });
	constructor() {
		super();

		let style = document.createElement("style");
		style.textContent = `
        .login-form {
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
            <notification-comp class="notification wrong-input" errorNotification notificationTitle="Error de autenticación">
            Por favor, ingrese los datos requeridos para continuar correctamente con la autenticación.
            </notification-comp>
            <notification-comp class="notification process" warnNotification notificationTitle="Aguarde un momento">
            Se estan verificando los datos de seguridad...
            </notification-comp>

            <form action="submit" class="auth-form">
                <div class="input-container">
                    <label class="input__label" for="username">Autenticación</label>
                    <input id="username" name="username" class="input__field" type="text" placeholder="Nombre de usuario" value="${this.textContent}" required>
                </div>
                <div class="confirmation-container">
                    <btn-comp class="submit-button" requestBtn darkBtn>Continuar</btn-comp>
                </div>
            </form>
        `;
	}

	addListeners() {
		const authFormEl: HTMLFormElement =
			this.shadow.querySelector(".auth-form");

		const inputFieldEl: HTMLInputElement =
			this.shadow.querySelector(".input__field");

		const submitBtnEl: HTMLButtonElement =
			this.shadow.querySelector(".submit-button");

		const shadowSubmitBtnEl: HTMLButtonElement =
			submitBtnEl.shadowRoot.querySelector(".button");

		const wrongInputNotifEl: HTMLElement =
			this.shadow.querySelector(".wrong-input");

		const processNotifEl: HTMLElement =
			this.shadow.querySelector(".process");

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

		processNotifEl.addEventListener("click", () => {
			hideNotification(processNotifEl);
		});

		inputFieldEl.addEventListener("invalid", () => {
			showNotification(wrongInputNotifEl);
		});

		document.addEventListener("keypress", () => {
			inputFieldEl.focus();
		});

		document.addEventListener("keydown", (e) => {
			if (e.key == "Enter") {
				submitBtnEl.click();
			}
		});

		submitBtnEl.addEventListener("click", (e) => {
			e.preventDefault();
			if (shadowSubmitBtnEl.classList.contains("request-btn")) {
				shadowSubmitBtnEl.disabled = true;
				shadowSubmitBtnEl.textContent = "Enviando...";
			}
			authFormEl.requestSubmit();
		});

		authFormEl.addEventListener("submit", (e) => {
			const target = e.target as HTMLFormElement;
			e.preventDefault();
			const userName: string = target.username.value;

			const formSubmissionPromise = state.sendAuthData(userName);

			formSubmissionPromise.then((res) => {
				if (res.status == 201) {
					showNotification(processNotifEl);

					const getUserIdPromise = res.response.then((res) => {
						return res.id;
					});

					getUserIdPromise.then((id) => {
						state.setUserAuthData(id, userName);
					});

					hideNotification(processNotifEl);

					const path = state.getLocationAfterAuth();
					Router.go(path);
				} else if (res.status == 302) {
					showNotification(processNotifEl);

					const getUserIdPromise = res.response.then((res) => {
						return res[0].id;
					});

					getUserIdPromise.then((userId) => {
						state.setUserAuthData(userId, userName);
					});

					const userAuthId: string = state.getUserAuthData().userId;
					const userAuthPromise = state.pullUserData(userAuthId);

					userAuthPromise.then((res) => {
						if (res.status == 302) {
							const userDataPromise = res.response.then(
								(data) => {
									return data;
								}
							);
							userDataPromise.then((user) => {
								if (user.userName == userName) {
									hideNotification(processNotifEl);
									const path = state.getLocationAfterAuth();
									Router.go(path);
								}
							});
						}
					});
				}
			});
		});
	}
}

customElements.define("auth-form", AuthFormComponent);
