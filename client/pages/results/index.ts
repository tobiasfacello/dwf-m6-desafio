import { state } from "../../state";
import { Router } from "@vaadin/router";

//! Images
const winnerImg = require("url:../../assets/winner.png");
const loserImg = require("url:../../assets/loser.png");
const drawImg = require("url:../../assets/draw.png");

customElements.define(
	"results-page",
	class initResultsPage extends HTMLElement {
		connectedCallback() {
			const headerEl = document.querySelector(".header") as HTMLElement;
			headerEl.style.display = "flex";

			const secureId = state.getRoomAccessData().secureId;
			const userAuthId: string = state.getUserAuthData().userId;
			state.updatePlayerChoice(secureId, userAuthId, "");

			state.initGameRoom(secureId);
			state.subscribe(() => {
				this.render();
				this.addListeners();
			});
			this.render();
			this.addListeners();
		}

		getResult() {
			const currentState = state.getState();
			return currentState.history.result;
		}

		getImgResult() {
			const currentState = state.getState();
			if (currentState.history.result == "Ganaste!") {
				return winnerImg;
			} else if (currentState.history.result == "Perdiste") {
				return loserImg;
			} else {
				return drawImg;
			}
		}

		render() {
			this.innerHTML = `
            <div class="div-container
            ${this.getResult() == "Ganaste!" ? "winner-bkgd" : ""}
            ${this.getResult() == "Perdiste" ? "loser-bkgd" : ""}
            ">
                <img class="result-img" src="${this.getImgResult()}">
                <h2 class="result-title">${this.getResult().toUpperCase()}</h2>
                <scoreboard-comp></scoreboard-comp>
                <div class="button-container">
                    <btn-comp class="btn play-again" mintBtn>Volver a jugar</btn-comp>
                    <btn-comp class="btn exit" redBtn>Salir</btn-comp>
                </div>
            </div>
            `;

			const style = document.createElement("style");
			style.textContent = `
            .div-container {
                height: calc(100vh - 60px);
                display: flex;
                flex-direction: column;
                justify-content: space-evenly;
                align-items: center;
                padding: 0 30px;
            }

            .winner-bkgd {
                background-color: rgba(99, 251, 211, 0.45);
            }

            .loser-bkgd {
                background-color: rgba(200, 0, 44, 0.45);
            }

            .result-img {
                width: 65px;
            }

            .result-title {
                margin: 0;
                font-family: "Syncopate", sans-serif;
                font-size: 30px;
                font-weight: 700;
                color: #fff;
                text-shadow: 0 0 10px #fff;
            }

            .button-container {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                gap: 25px;
            }
        `;

			this.appendChild(style);
		}

		async setOnlineValues() {
			const secureId = state.getRoomAccessData().secureId;
			const userAuthId: string = state.getUserAuthData().userId;

			await state.updatePlayerStatus(secureId, userAuthId, "online");
			await state.setPlayersSelections(false);
		}

		async setOfflineValues() {
			const secureId = state.getRoomAccessData().secureId;
			const userAuthId: string = state.getUserAuthData().userId;

			await state.updatePlayerStatus(secureId, userAuthId, "offline");
			await state.updatePlayerChoice(secureId, userAuthId, "");
		}

		addListeners() {
			const headerEl = document.querySelector(".header") as HTMLElement;
			const headerShadowEl = headerEl.shadowRoot.querySelector(
				".header"
			) as HTMLElement;

			const rpsContainer = document.querySelector(
				".rps-container"
			) as HTMLElement;

			const buttonEl = this.querySelectorAll(".btn");
			const playAgainBtnEl: HTMLButtonElement =
				this.querySelector(".play-again");

			const exitBtnEl: HTMLButtonElement = this.querySelector(".exit");

			buttonEl.forEach((btn) => {
				btn.addEventListener("click", () => {
					headerShadowEl.style.backgroundColor = "transparent";
					rpsContainer.style.display = "flex";
				});
			});

			playAgainBtnEl.addEventListener("click", () => {
				const onlineValuesPromise = this.setOnlineValues();
				onlineValuesPromise.then(() => {
					Router.go("/gameroom/instructions");
				});
			});

			exitBtnEl.addEventListener("click", async () => {
				const offlineValuesPromise = this.setOfflineValues();
				offlineValuesPromise.then(() => {
					Router.go("/home");
				});
			});
		}
	}
);
