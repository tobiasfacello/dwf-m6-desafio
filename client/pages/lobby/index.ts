import { state } from "../../state";

customElements.define(
	"lobby-page",
	class initLobbyPage extends HTMLElement {
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
                    <div class="title-container">
                        <title-component>Piedra Papel ó Tijeras</title-component>
                    </div>
                    <div class="info-container">
                        <emph-text>Enviale el ID a tu oponente:</emph-text>
                        <span class="friendly-id">
                            <emph-text darkText>
                                ${state.getRoomAccessData().friendlyId}
                            </emph-text>
                        </span>
                        <btn-comp class="continue-button" path="/gameroom/instructions" darkBtn>Copiar código y Continuar</btn-comp>
                    </div>
                </div>
                `;

			const style = document.createElement("style");
			style.textContent = `
    
            .div-container {
                height: calc(100vh - 225px);
                display: flex;
                flex-direction: column;
                justify-content: space-evenly;
                align-items: center;
                padding: 20px;
            }

            .info-container {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: center;
                gap: 20px;
            }

            .friendly-id {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 200px;
                height: 50px;
                border: none;
                border-radius: 5px;
                background: linear-gradient(180deg, #FCFFDF 0%, #DFE0DF 100%);
            }
        `;

			this.appendChild(style);
		}

		addListeners() {
			const copyBtnEl: HTMLButtonElement =
				this.querySelector(".continue-button");

			copyBtnEl.addEventListener("click", () => {
				const friendlyId = state.getRoomAccessData().friendlyId;
				navigator.clipboard.writeText(friendlyId);
				window.alert("Vínculo copiado en portapapeles");
			});
		}
	}
);
