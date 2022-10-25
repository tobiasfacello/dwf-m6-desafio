class TextComponent extends HTMLElement {
	shadow = this.attachShadow({ mode: "open" });
	constructor() {
		super();
		this.render();

		const style = document.createElement("style");

		style.textContent = `
        .text {
            width: 250px;
            margin: 20px 0;
            font-family: "Raleway", sans-serif;
            font-size: 17px;
            font-weight: 400;
            text-align: center;
            color: #EEE;
        }

        .text b {
            font-weight: 700;
            color: #ff7e77;
        }

        @media (min-width: 960px) {
            .text {
                300px;
            }
        }

        .dark-text {
            color: #272A32;
        }
        `;

		this.shadow.appendChild(style);
	}

	render() {
		this.shadow.innerHTML = `
        <p class="text
        ${this.hasAttribute("darkText") ? "dark-text" : ""}
        ">${this.innerHTML}</p>
        `;
	}
}

customElements.define("emph-text", TextComponent);
