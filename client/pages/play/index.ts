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

			const secureGameRoomId =
				state.getState().currentGameRoom.accessData.secureId;

			state.checkPlayersSelections() == false
				? state.getPlayersChoices(secureGameRoomId)
				: console.log("Choices Already Checked");

			this.render();
			this.addListeners();
		}

		render() {
			this.innerHTML = `
				<div class="div-container">
					<timer-comp></timer-comp>
					<div class="options-container">
						<hand-comp class="hand" type="tijeras" hand="tijeras"></hand-comp>
						<hand-comp class="hand" type="piedra" hand="piedra"></hand-comp>
						<hand-comp class="hand" type="papel" hand="papel"></hand-comp>
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
			`;

			this.appendChild(style);
		}

		addListeners() {
			const rpsContainer = document.querySelector(
				".rps-container"
			) as HTMLElement;

			let counter = 3.7;

			const intervals = setInterval(() => {
				counter--;
				if (counter < -1) {
					clearInterval(intervals);

					const secureId = state.getRoomAccessData().secureId;
					const userAuthId: string = state.getUserAuthData().userId;

					const updateStatusPromise = state.updatePlayerStatus(
						secureId,
						userAuthId,
						"online"
					);

					updateStatusPromise.then(() => {
						rpsContainer.style.display = "flex";
						Router.go("/gameroom/timeout");
					});
				}
			}, 1000);

			const optionsContainer: HTMLCollection =
				this.querySelector(".options-container").children;

			for (const play of optionsContainer) {
				play.addEventListener("click", (e) => {
					e.preventDefault();
					const userPlay = play.getAttribute("type") as Jugada;

					const secureId = state.getRoomAccessData().secureId;
					const userAuthId: string = state.getUserAuthData().userId;

					const updateChoicePromise = state.updatePlayerChoice(
						secureId,
						userAuthId,
						userPlay
					);

					updateChoicePromise.then(() => {
						state.getPlayersChoices(secureId);

						if (state.checkPlayersSelections() == true) {
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

							const oponentHand =
								this.querySelector(".oponent-hand");
							const oponentHandImg =
								oponentHand.shadowRoot.querySelector(
									".hand-img"
								);

							oponentHandImg.setAttribute(
								"style",
								`
								height: 100%;
								width: 200px;
								transform: rotate(180deg);
								`
							);

							this.appendChild(style);

							let counterResult = 0.7;
							const intervalResultAppearance = setInterval(() => {
								counterResult--;
								if (counterResult < 0) {
									clearInterval(intervals);
									clearInterval(intervalResultAppearance);

									const updateStatusPromise =
										state.updatePlayerStatus(
											secureId,
											userAuthId,
											"online"
										);

									updateStatusPromise.then(() => {
										Router.go("/gameroom/results");
									});
								}
							}, 1000);
						}
					});
				});
			}
		}
	}
);
