class HeaderComponent extends HTMLElement {
	shadow = this.attachShadow({ mode: "open" });
	constructor() {
		super();

		let style = document.createElement("style");
		style.textContent = `
        .header {
            width: 100vw;
            height: 60px;
			display: flex;
			justify-content: space-between;
			align-items: center;
        }
        `;

		this.render();
		this.shadow.appendChild(style);
		this.addListeners();
	}

	render() {
		this.shadow.innerHTML = `
        <header class="header">
			<div class="header__button">
				<modal-btn-comp class="btn return-modal" returnBtn></modal-btn-comp>
			</div>
			<div class="header__button">
				<modal-btn-comp class="btn options-modal" optionsBtn></modal-btn-comp>
			</div>
        </header>
        `;
	}

	addListeners() {
		const headerEl = this.querySelector(".header") as HTMLElement;

		window.addEventListener("hashchange", () => {
			if (location.pathname !== "/gameroom/results") {
				headerEl.style.backgroundColor = "transparent";
			}
		});
	}
}
customElements.define("header-comp", HeaderComponent);
