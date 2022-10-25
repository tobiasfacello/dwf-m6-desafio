import { state } from "../../state";

customElements.define(
	"waitroom-page",
	class initInstructionPage extends HTMLElement {
		connectedCallback() {
			const secureGameRoomId =
				state.getState().currentGameRoom.accessData.secureId;

			state.checkRealtimeConnection() == false
				? state.getPlayersStatus(secureGameRoomId)
				: console.log("Status Already Checked");

			state.subscribe(() => {
				this.render();
			});

			this.render();
			this.addListeners();
		}

		render() {
			this.innerHTML = `
            <div class="div-container">
                <emph-text class="title">Sala de espera</emph-text>
                <div class="rules-container">
                    <scoreboard-comp>HISTORY SCORE</scoreboard-comp>
                    <emph-text>
                        Esperando que <b>${this.getPlayerName()}</b> presione "Jugar"...
                    </emph-text>
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

		getPlayerName() {
			const currentState = state.getState();
			const userId = state.getUserAuthData().userId;
			const playersData = Object.entries(
				currentState.currentGameRoom.playersData
			);

			const oponentData = playersData.find((data: any) => {
				if (data[0] !== userId) {
					return data[1];
				}
			});

			const oponentName = oponentData[1]["name"];

			return oponentName;
		}
		addListeners() {}
	}
);
