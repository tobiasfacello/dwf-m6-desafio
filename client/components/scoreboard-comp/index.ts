import { state } from "../../state";

class ScoreComponent extends HTMLElement {
	shadow = this.attachShadow({ mode: "open" });
	constructor() {
		super();

		this.render();

		const style = document.createElement("style");

		style.textContent = `
        .score-container {
            width: 320px;
            height: 120px;
            padding: 10px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: var(--dark-gradient);
            border-radius: 10px;
        }

        .score-title {
            font-family: "Raleway", sans-serif;
            font-size: 20px;
            font-weight: 600;
            text-align: center;
            text-shadow: 0 0 3px #C8FCEA;
            color: #FFF;
        }

        .user-data,
        .oponent-data {
            width: 50%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-evenly;
            align-items: center;
            text-shadow: 0 0 3px #fff;
        }

        .user-score,
        .oponent-score {
            margin: 0;
            font-family: "Poppins", sans-serif;
            font-size: 30px;
            font-weight: 500;
            color: #eee;
        }
        `;

		this.shadow.appendChild(style);
	}

	getPlayerName() {
		const currentState = state.getState();
		const userId = state.getUserAuthData().userId;
		const playersData = Object.entries(
			currentState.currentGameRoom.playersData
		);

		const playersNames = playersData.map((data: any) => {
			if (data[0] == userId) {
				return {
					userName: data[1].name,
				};
			} else if (data[0] !== userId) {
				return {
					oponentName: data[1].name,
				};
			}
		});

		const user = playersNames.find((player) => player.userName);
		const oponent = playersNames.find((player) => player.oponentName);

		if (playersNames.length == 2) {
			return {
				user: user.userName,
				oponent: oponent.oponentName,
			};
		} else if (playersNames.length == 1) {
			return {
				user: user.userName,
				oponent: "¿...?",
			};
		} else {
			return {
				user: "¿...?",
				oponent: "¿...?",
			};
		}
	}

	getPlayerStatus() {
		const currentState = state.getState();
		const userId = state.getUserAuthData().userId;
		const playersData = Object.entries(
			currentState.currentGameRoom.playersData
		);

		const playersStatus = playersData.map((data: any) => {
			if (data[0] == userId) {
				return {
					userStatus: data[1].status,
				};
			} else if (data[0] !== userId) {
				return {
					oponentStatus: data[1].status,
				};
			}
		});

		const user = playersStatus.find((player) => player.userStatus);
		const oponent = playersStatus.find((player) => player.oponentStatus);

		if (playersStatus.length == 2) {
			return {
				user: user.userStatus,
				oponent: oponent.oponentStatus,
			};
		} else if (playersStatus.length == 1) {
			return {
				user: user.userStatus,
				oponent: "offline",
			};
		} else {
			return {
				user: "offline",
				oponent: "offline",
			};
		}
	}

	getScores() {
		const currentState = state.getState();
		const userId = state.getUserAuthData().userId;
		const playersData = Object.entries(
			currentState.currentGameRoom.playersData
		);

		const playersScores = playersData.map((data: any) => {
			if (data[0] == userId) {
				return {
					userScore: data[1].score.toString(),
				};
			} else if (data[0] !== userId) {
				return {
					oponentScore: data[1].score.toString(),
				};
			}
		});

		const user = playersScores.find((player) => player.userScore);
		const oponent = playersScores.find((player) => player.oponentScore);

		if (playersScores.length == 2) {
			return {
				user: user.userScore,
				oponent: oponent.oponentScore,
			};
		} else if (playersScores.length == 1) {
			return {
				user: user.userScore,
				oponent: "-",
			};
		} else {
			return {
				user: "-",
				oponent: "-",
			};
		}
	}

	render() {
		this.shadow.innerHTML = `
        <div class="score-container">
            <div class="user-data">
                <user-profile ${this.getPlayerStatus().user}>
                    ${this.getPlayerName().user}
                </user-profile>
                <p class="user-score">${this.getScores().user}</p>
            </div>
            <h2 class="score-title">HISTORY SCORE</h2>
            <div class="oponent-data">
                <user-profile ${this.getPlayerStatus().oponent}>
                ${this.getPlayerName().oponent}
                </user-profile>
                <p class="oponent-score">${this.getScores().oponent}</p>
            </div>
        </div>
        `;
	}
}

customElements.define("scoreboard-comp", ScoreComponent);
