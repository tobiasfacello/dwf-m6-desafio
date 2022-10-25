import { Router } from "@vaadin/router";

class ButtonComponent extends HTMLElement {
	shadow = this.attachShadow({ mode: "open" });
	constructor() {
		super();

		let style = document.createElement("style");
		style.textContent = `
        .button {
			min-width: 190px;
			width: 300px;
			height: 50px;
			font-family: "Raleway", sans-serif;
			font-weight: 500;
			font-size: 17px;
			text-align: center;
			border: none;
			border-radius: 5px;
			color: #272A32;
			box-shadow: 0 4px 4px rgba(0, 0, 0, 0.3);
        }

		  .button:hover {
			cursor: pointer;
			box-shadow: 0 4px 4px rgba(0, 0, 0, 0.5);
		  }

		@media (min-width: 768px) {
			.button {
				width: 380px;
			}
		}

		.resized-btn {
			width: 190px;
		}

		.rps-btn {
			color: #EEEEEE;
			background-image: var(--rps-gradient);
		}

		.salmon-btn {
			background-image: var(--salmon-gradient);
		}

		.red-btn {
			color: #EEEEEE;
			background-image: var(--red-gradient);
		}

		.yellow-btn {
			background-image: var(--yellow-gradient);
		}

		.grey-btn {
			background: var(--grey-gradient);
		}

		.mint-btn {
			background: var(--mint-gradient);
		}

		.dark-btn {
			color: #EEEEEE;
			background: var(--dark-gradient);
		}
		`;

		this.render();
		this.shadow.appendChild(style);
		this.addListeners();
	}

	render() {
		this.shadow.innerHTML = `
        <button class="button
		${this.hasAttribute("resizedBtn") ? "resized-btn" : ""}
		${this.hasAttribute("rpsBtn") ? "rps-btn" : ""}
		${this.hasAttribute("salmonBtn") ? "salmon-btn" : ""}
		${this.hasAttribute("redBtn") ? "red-btn" : ""}
		${this.hasAttribute("yellowBtn") ? "yellow-btn" : ""}
		${this.hasAttribute("darkBtn") ? "dark-btn" : ""} 
		${this.hasAttribute("greyBtn") ? "grey-btn" : ""}
		${this.hasAttribute("mintBtn") ? "mint-btn" : ""}
		"
		type="submit"
		${this.hasAttribute("path") ? `path="${this.getAttribute("path")}"` : ""}
		${this.hasAttribute("link") ? `link="${this.getAttribute("link")}"` : ""}
		>
            ${this.textContent}
        </button>
        `;
	}

	addListeners() {
		const buttonEl = this.shadow.querySelector(
			".button"
		) as HTMLButtonElement;

		buttonEl.addEventListener("click", (e) => {
			const target = e.target as HTMLElement;
			if (target.hasAttribute("path")) {
				const route = target.getAttribute("path");
				Router.go(route);
			} else if (target.hasAttribute("link")) {
				const url = target.getAttribute("link");
				window.open(url, "_blank");
			}
		});
	}
}
customElements.define("btn-comp", ButtonComponent);
