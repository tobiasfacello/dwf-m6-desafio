const hands = {
	tijeras: require("url:../../assets/tijeras.png"),
	piedra: require("url:../../assets/piedra.png"),
	papel: require("url:../../assets/papel.png"),
};

class HandComponent extends HTMLElement {
	shadow = this.attachShadow({ mode: "open" });
	constructor() {
		super();

		const style = document.createElement("style");
		style.textContent = `
		.play-button {
			border: none;
		}

		@media (min-width: 960px) {
			.play-button img:active {
				border-radius: 10px;
			}
		}

		.hand-img {
			height: 100%;
            width: 100px;
        }

		.hand-img:active {
			backgroud-color: #fff;
		}

		@media (min-width: 960px) {
			.hand-img {
				width: 150px;
			}
		}
		`;

		this.render();
		this.shadow.appendChild(style);
		this.addListeners();
	}

	addListeners() {
		this.addEventListener("click", () => {
			const event = new CustomEvent("selectHand", {
				detail: {
					handPlay: this.getAttribute("hand"),
				},
			});
			this.dispatchEvent(event);
		});
	}

	render() {
		const typeAttr = this.getAttribute("type");
		const handAttr = this.getAttribute("hand");
		this.shadow.innerHTML = `
		<div class="play-button" type="${typeAttr}"><img class="hand-img" src="${hands[handAttr]}"></div>
		`;
	}
}

customElements.define("hand-comp", HandComponent);
