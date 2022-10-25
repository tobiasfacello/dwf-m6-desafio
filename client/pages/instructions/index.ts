import { state } from "../../state";

customElements.define(
	"instructions-page",
	class initInstructionPage extends HTMLElement {
		connectedCallback() {
			const secureGameRoomId =
				state.getState().currentGameRoom.accessData.secureId;
			state.initGameRoom(secureGameRoomId);

			state.subscribe(() => {
				this.render();
				this.addListeners();
			});
			this.render();
			this.addListeners();
		}

		render() {
			this.innerHTML = `
            <div class="div-container">
                <emph-text class="title">Instrucciones</emph-text>
                <div class="rules-container">
                    <scoreboard-comp></scoreboard-comp>
                    <emph-text>
                        Presioná jugar y elegí: Piedra, Papel o Tijeras antes de que pasen los 3 segundos.
                    </emph-text>
                    <btn-comp class="start-button" resizedBtn mintBtn>Jugar</btn-comp>
                </div>
            </div>
            `;

			const style = document.createElement("style");
			style.textContent = `
        
                .div-container {
                    height: calc(100vh - 225px);
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    align-items: center;
                    padding: 20px;
                }

                .rules-container {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-evenly;
                    align-items: center;
                }
            `;

			this.appendChild(style);
		}

		addListeners() {
			const playBtnEl: HTMLButtonElement =
				this.querySelector(".start-button");

			playBtnEl.addEventListener("click", () => {
				const userAuthId: string = state.getUserAuthData().userId;
				const secureId: string = state.getRoomAccessData().secureId;
				const updateStatusPromise = state.updatePlayerStatus(
					secureId,
					userAuthId,
					"ready"
				);

				updateStatusPromise.then(() => {
					const secureGameRoomId =
						state.getState().currentGameRoom.accessData.secureId;
					state.getPlayersStatus(secureGameRoomId);
				});
			});
		}
	}
);
