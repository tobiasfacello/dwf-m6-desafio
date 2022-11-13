import { state, Jugada } from "../../state";
import { Router } from "@vaadin/router";

customElements.define(
	"play-page",
	class initPlayPage extends HTMLElement {
		connectedCallback() {
			const headerEl = document.querySelector(".header") as HTMLElement;
			headerEl.style.display = "none";

			const rpsContainer = document.querySelector(
				".rps-container"
			) as HTMLElement;
			rpsContainer.style.display = "none";

			this.render();
			this.addListeners();
		}

		render() {
			this.innerHTML = `
				<div class="div-container">
					<timer-comp></timer-comp>
					<div class="options-container">
						<hand-comp class="hand tijeras" type="tijeras" hand="tijeras"></hand-comp>
						<hand-comp class="hand piedra" type="piedra" hand="piedra"></hand-comp>
						<hand-comp class="hand papel" type="papel" hand="papel"></hand-comp>
					</div>
				</div>
			`;

			const style = document.createElement("style");
			style.textContent = `
		
				.div-container {
					height: 100vh;
					display: flex;
					flex-direction: column;
					justify-content: space-between;
					align-items: center;
					padding: 20px;
					padding-bottom: 0;
				}
				
				.options-container {
					width: 100%;
					display: flex;
					justify-content: space-evenly;
					align-items: end;
				}
		
				@media (min-width: 960px) {
					.options-container {
						width: 30%;
					}
				}

				.hand:hover {
					cursor: pointer;
				}

			`;

			this.appendChild(style);
		}

		addListeners() {
			const rpsContainer = document.querySelector(
				".rps-container"
			) as HTMLElement;

			let counter = 5;

			const intervals = setInterval(() => {
				counter--;
				if (counter == 0) {
					clearInterval(intervals);

					const secureId = state.getRoomAccessData().secureId;
					state.getPlayersChoices(secureId);
					const userAuthId: string = state.getUserAuthData().userId;

					const playersData =
						state.getState().currentGameRoom.playersData;
					const playersDataArr = Object.entries(playersData);

					let userPlay;
					let oponentPlay;

					playersDataArr.map((player: {}) => {
						if (player[0] == userAuthId) {
							userPlay = player[1].choice;
						} else {
							oponentPlay = player[1].choice;
						}
					});

					state.whoWins(userPlay, oponentPlay);
					const style = document.createElement("style");

					style.textContent = `
							.div-container {
								height: 101vh;
								display: flex;
								flex-direction: column;
								justify-content: center;
								align-items: center;
							}
						
							.oponent-play {
								height: 50vh;
								display: flex;
								justify-content: center;
							}
						
							.user-play {
								height: 51vh;
								display: flex;
								justify-content: center;
								align-items: flex-end;
							}
							`;

					this.innerHTML = `
							<div class="oponent-play">
							<hand-comp class="oponent-hand" type="${oponentPlay}" hand="${oponentPlay}"></hand-comp>
							</div>
							<div class="user-play">
							<hand-comp class="user-hand" type="${userPlay}" hand="${userPlay}"></hand-comp>
							</div>
							`;

					const userHand = this.querySelector(".user-hand");
					const userHandImg =
						userHand.shadowRoot.querySelector(".hand-img");
					userHandImg.setAttribute(
						"style",
						`
								height: 100%;
								width: 200px;
								`
					);

					const oponentHand = this.querySelector(".oponent-hand");
					const oponentHandImg =
						oponentHand.shadowRoot.querySelector(".hand-img");

					oponentHandImg.setAttribute(
						"style",
						`
								height: 100%;
								width: 200px;
								transform: rotate(180deg);
								`
					);

					this.appendChild(style);

					let counterResult = 2;
					const intervalResultAppearance = setInterval(() => {
						counterResult--;
						if (counterResult < 0) {
							const userAuthId: string =
								state.getUserAuthData().userId;

							clearInterval(intervalResultAppearance);

							const updateStatusPromise =
								state.updatePlayerStatus(
									secureId,
									userAuthId,
									"pending"
								);

							updateStatusPromise.then(() => {
								Router.go("/gameroom/results");
							});
						}
					}, 1000);
				} else if (counter < -1) {
					clearInterval(intervals);

					const secureId = state.getRoomAccessData().secureId;
					const userAuthId: string = state.getUserAuthData().userId;

					const updateStatusPromise = state.updatePlayerStatus(
						secureId,
						userAuthId,
						"pending"
					);

					updateStatusPromise.then(() => {
						rpsContainer.style.display = "flex";
						Router.go("/gameroom/timeout");
					});
				}
			}, 1000);

			const optionsContainer =
				this.querySelectorAll(".options-container");

			const rockHandEl: HTMLButtonElement = this.querySelector(".piedra");
			const paperHandEl: HTMLButtonElement = this.querySelector(".papel");
			const scissorsHandEl: HTMLButtonElement =
				this.querySelector(".tijeras");

			function changeButtonsPosition(val: string) {
				rockHandEl.style.position = `${val}`;
				paperHandEl.style.position = `${val}`;
				scissorsHandEl.style.position = `${val}`;
			}

			for (const play of optionsContainer) {
				play.addEventListener("click", (e) => {
					e.preventDefault();
					const target = e.target as HTMLButtonElement;

					if (target.classList.contains("piedra")) {
						changeButtonsPosition("relative");
						rockHandEl.style.bottom = "100px";
						paperHandEl.style.top = "50px";
						scissorsHandEl.style.top = "50px";
					} else if (target.classList.contains("papel")) {
						changeButtonsPosition("relative");
						paperHandEl.style.bottom = "100px";
						rockHandEl.style.top = "50px";
						scissorsHandEl.style.top = "50px";
					} else if (target.classList.contains("tijeras")) {
						changeButtonsPosition("relative");
						scissorsHandEl.style.bottom = "100px";
						rockHandEl.style.top = "50px";
						paperHandEl.style.top = "50px";
					}

					const userPlay = target.getAttribute("type") as Jugada;

					const secureId = state.getRoomAccessData().secureId;
					const userAuthId: string = state.getUserAuthData().userId;

					const updateChoicePromise = state.updatePlayerChoice(
						secureId,
						userAuthId,
						userPlay
					);

					// updateChoicePromise.then(() => {

					// });
				});
			}
		}
	}
);
