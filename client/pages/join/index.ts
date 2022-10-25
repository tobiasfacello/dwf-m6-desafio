import { state } from "../../state";

customElements.define(
	"join-page",
	class initJoinPage extends HTMLElement {
		connectedCallback() {
			this.render();
		}

		render() {
			this.innerHTML = `
            <div class="div-container">
                <div class="title-container">
                    <title-component>Piedra Papel ó Tijeras</title-component>
                </div>
                <div class="form-container">
                    <join-form></join-form>
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
                padding-top: 0;
            }

            .button-container {
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                gap: 25px;
            }
        `;
			this.appendChild(style);
		}
	}
);
