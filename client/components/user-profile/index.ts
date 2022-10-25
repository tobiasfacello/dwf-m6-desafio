const alienEmoji = require("url:../../assets/alien.png");
const offlineIcon = require("url:../../assets/offline.png");
const onlineIcon = require("url:../../assets/online.png");
const pendingIcon = require("url:../../assets/pending.png");
const readyIcon = require("url:../../assets/ready.png");

class UserProfileComponent extends HTMLElement {
	shadow = this.attachShadow({ mode: "open" });
	constructor() {
		super();

		let style = document.createElement("style");
		style.textContent = `
        
        .user-container {
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: cener;
        }
        .picture-wrapper {
            width: 30px;
            height: 30px;
            padding: 5px;
            margin: 0 auto;
            background: var(--salmon-gradient);
            border: none;
            border-radius: 5px;
        }
        .user__profile-pic {
            width: 100%;
            height: 100%;
        }

        .user__status {
            position: relative;
            top: -8px;
            left: 10px;
            width: 10px;
            height: 10px;
        }

        .user__name {
            width: 100%;
            margin: 0;
            margin-top: 10px;
            margin-bottom: 5px;
            font-family: "Raleway", sans-serif;
            font-weight: 400;
            font-size: 16px;
            text-align: center;
            color: #FFFFFF;
        }
		`;

		this.render();
		this.shadow.appendChild(style);
		this.addListeners();
	}

	render() {
		this.shadow.innerHTML = `
            <div class="user-container">
                <div class="picture-wrapper">
                    <img src="${alienEmoji}" class="user__profile-pic" alt="User Profile">
                    <img src="
                    ${this.hasAttribute("offline") ? `${offlineIcon}` : ""}
                    ${this.hasAttribute("online") ? `${onlineIcon}` : ""}
                    ${this.hasAttribute("pending") ? `${pendingIcon}` : ""}
                    ${this.hasAttribute("ready") ? `${readyIcon}` : ""}
                    " class="user__status">
                </div>
                <h3 class="user__name">${this.textContent}</h3>
            </div>
        `;
	}

	addListeners() {}
}
customElements.define("user-profile", UserProfileComponent);
