import { state } from "../../state";

customElements.define(
	"home-page",
	class initHomePage extends HTMLElement {
		connectedCallback() {
			const rpsContainerEl: HTMLElement =
				document.querySelector(".rps-container");
			rpsContainerEl.style.display = "flex";

			this.render();
			this.addListeners();
		}
		render() {
			this.innerHTML = `
                <div class="div-container">
                    <div class="title-container">
                        <title-component>Piedra Papel ó Tijeras</title-component>
                    </div>
                    <div class="button-container">
                        <btn-comp class="btn create-gameroom" location="/gameroom/lobby" path="/auth" salmonBtn>Nuevo juego</btn-comp>
                        <btn-comp class="btn join-gameroom" location="/join" path="/auth" darkBtn>Ingresar a una sala</btn-comp>
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

            .button-container {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                gap: 25px;
                padding: 10px 0;

            }
        `;

			this.appendChild(style);
		}

		addListeners() {
			const createBtnEl: HTMLButtonElement =
				this.querySelector(".create-gameroom");

			const joinBtnEl: HTMLButtonElement =
				this.querySelector(".join-gameroom");

			createBtnEl.addEventListener("click", (e) => {
				const target = e.target as HTMLButtonElement;
				const locationAttr = target.getAttribute("location");

				const currentState = state.getState();
				const userId = currentState.userAuthData.userId;
				const userName = currentState.userAuthData.userName;

				const roomCreationPromise = state.createGameRoom(
					userId,
					userName
				);

				roomCreationPromise
					.then((res) => {
						return res.response;
					})
					.then((gameRoomData) => {
						const friendlyId: string = gameRoomData.friendlyId;
						const secureId: string = gameRoomData.secureId;

						state.setRoomAccessData(friendlyId, secureId);
					});

				state.setLocationAfterAuth(locationAttr!);
			});

			joinBtnEl.addEventListener("click", (e) => {
				const target = e.target as HTMLButtonElement;
				const locationAttr = target.getAttribute("location");

				state.setLocationAfterAuth(locationAttr);
			});
		}
	}
);
