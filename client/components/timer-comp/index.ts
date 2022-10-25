class TimerComponent extends HTMLElement {
	shadow = this.attachShadow({ mode: "open" });
	constructor() {
		super();
		this.countdown();
	}

	render(timeLeft) {
		this.shadow.innerHTML = `
        <div class="seconds-container">
            <h2 class="seconds">${timeLeft}</h2>
        </div>
        `;

		const style = document.createElement("style");
		style.textContent = `
        .seconds-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            width: 200px;
            height: 200px;
            margin-top: 50px;
            background-color: rgba(0,0,0, 0.1);
            border: 20px solid #eee;
            animation: progress 3s linear;
            animation-duration: 1000ms;
            border-radius: 200px;
        }

        .seconds {
            font-size: 70px;
            font-family: "Syncopate", sans-serif;
            font-weight: Bold;
            color: #fff;
        }

        @keyframes progress {
            0% {
                border-color: #90006F;
            }
            25% {
                border-color: #D03260;
            }
            50% {
                border-color: #F6734F;
            }
            100% {
                border-color: #A12517;
            }
        }
        `;
		this.shadow.appendChild(style);
	}

	countdown() {
		let counter = 3;
		const intervals = setInterval(() => {
			if (counter >= 0) {
				this.render(counter);
				counter--;
			} else {
				clearInterval(intervals);
			}
		}, 1000);
	}
}
customElements.define("timer-comp", TimerComponent);
