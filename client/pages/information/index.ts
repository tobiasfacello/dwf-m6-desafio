const linkedin = require("url:../../images/3d-fluency-linkedin.png");
const github = require("url:../../images/3d-fluency-github.png");
const twitter = require("url:../../images/3d-fluency-twitter.png");
const apxLogo = require("url:../../images/apx-logo-over-yellow.png");

export function initGreetingsPage() {
	const divEl = document.createElement("div");
	divEl.classList.add("div-container");

	divEl.innerHTML = `
    <text-component>Gracias por participar!</text-component>
        <div class="social-media-container">
            <div class="social-media">
                <a href="https://www.linkedin.com/in/tobiasfacello/" target="blank_"><img class ="social-media-img" src="${linkedin}"></a>
                <h2 class="user">@tobiasfacello</h2>
            </div>
            <div class="social-media">
                <a href="https://github.com/tobiasfacello" target="blank_"><img class ="social-media-img" src="${github}"></a>                <h2 class="user">@tobiasfacello</h2>
            </div>
            <div class="social-media">
                <a href="https://twitter.com/fache_dev" target="blank_"><img class ="social-media-img" src="${twitter}"></a>
                <h2 class="user">@fache_dev</h2>
            </div>
        </div>

        <img class="apx-logo" src="${apxLogo}">

        <div class="apx-greetings">
        <h2 class="greetings-text">Carrera DWF</h2>
        <h2 class="greetings-text">Desafío: Módulo 5</h2>
        <h2 class="greetings-text">Piedra, Papel ó Tijeras</h2>
        </div>

    `;

	const style = document.createElement("style");

	style.textContent = `
    .div-container {
        width: 100%;
        height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
    }

    @media (min-width: 960px) {
        .div-container {
            flex-direction: row;
        }
    }

    .apx-greetings {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
        margin: 30px 0;
        padding: 10px;
        border-radius: 10px;
        background: linear-gradient(109.6deg, rgba(33,25,180,1) 11.2%, rgba(253,29,29,1) 55.2%, rgba(252,176,69,1) 91.1%);
        background-size: 600% 600%;
        animation: gradient 3s ease infinite;
    }

    .apx-logo {
        width: 170px;
        margin-top: 40px;
    }

    .social-media-container {
        padding: 20px;
        border-radius: 10px;
        background: linear-gradient(109.6deg, rgba(33,25,180,1) 11.2%, rgba(253,29,29,1) 55.2%, rgba(252,176,69,1) 91.1%);
        background-size: 600% 600%;
        animation: gradient 3s ease infinite;
    }

    .social-media {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .social-media-img {
        width: 50px;
    }

    .greetings-text,
    .user {
        font-family: "Poppins", sans-serif;
        font-size: 20px;
        font-weight: 700;
        color: #eee;
        text-shadow: 0 0 10px #fff;
    }

    @keyframes gradient {
        0% {
            background-position: 0% 50%;
        }
        50% {
            background-position: 100% 50%;
        }
        100% {
            background-position: 0% 50%;
        }
    }

    `;

	divEl.appendChild(style);

	return divEl;
}
