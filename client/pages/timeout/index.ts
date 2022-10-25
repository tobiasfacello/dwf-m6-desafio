import { state } from "../../state";
 
customElements.define(
	"timeout-page",
	class initTimeoutPage extends HTMLElement {
		connectedCallback() {
			const headerEl: HTMLElement = document.querySelector(".header");
			headerEl.style.display = "flex";

			this.render();
			this.addListeners();
		}
		render() {
			this.innerHTML = `
			<div class="div-container">
				<title-component>Se acabó el tiempo</title-component>
				<emph-text>Uno de los dos jugadores se quedó sin tiempo.</emph-text>
				<btn-comp class="btn play-again" path="/gameroom/instructions" mintBtn>Volver a jugar</btn-comp>
				<btn-comp class="btn exit" path="/home" redBtn>Salir</btn-comp>
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
		`;

			this.appendChild(style);
		}

		addListeners() {
			const playAgainBtnEl: HTMLButtonElement =
				this.querySelector(".play-again");
			const exitBtnEl: HTMLButtonElement = this.querySelector(".exit");

			playAgainBtnEl.addEventListener("click", () => {
				const secureId = state.getRoomAccessData().secureId;
				const userAuthId: string = state.getUserAuthData().userId;
				state.updatePlayerStatus(secureId, userAuthId, "ready");
			});

			exitBtnEl.addEventListener("click", () => {
				const secureId = state.getRoomAccessData().secureId;
				const userAuthId: string = state.getUserAuthData().userId;
				state.updatePlayerStatus(secureId, userAuthId, "offline");
			});
		}
	}
);
