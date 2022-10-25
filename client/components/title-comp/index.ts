class TitleComponent extends HTMLElement {
	shadow = this.attachShadow({ mode: "open" });
	constructor() {
		super();

		this.render();

		const style = document.createElement("style");
		style.textContent = `

        .title {
            width: 260px;
            margin: 0 auto;
            padding: 5px;
            font-family: "Syncopate", sans-serif;
            font-size: 45px;
            font-weight: Bold;
            text-align: center;
            text-shadow: 0 0 5px #eee;
            line-height: 55px;
            border-radius: 10px;
            background-image: var(--grey-gradient);
            background-size: 100%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent; 
            -moz-background-clip: text;
            -moz-text-fill-color: transparent;
        }

        @media (min-width: 768px) {
            width: 300px;
            font-size: 50px;
            line-height: 60px;
        }
        `;

		this.shadow.appendChild(style);
	}

	render() {
		this.shadow.innerHTML = `
        <h1 class="title">${this.textContent}</h1>
        `;
	}
}

customElements.define("title-component", TitleComponent);
