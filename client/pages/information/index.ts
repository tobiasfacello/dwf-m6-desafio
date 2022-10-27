const rpsApp = require("url:../../assets/rps-app.png");

const htmlIcon = require("url:../../assets/html5.svg");
const cssIcon = require("url:../../assets/css3.svg");
const tsIcon = require("url:../../assets/typescript.svg");
const nodeIcon = require("url:../../assets/nodejs.svg");
const expressIcon = require("url:../../assets/express.svg");
const firebaseIcon = require("url:../../assets/firebase.svg");
const postmanIcon = require("url:../../assets/postman.svg");
const parcelIcon = require("url:../../assets/parcel.svg");
const githubIcon = require("url:../../assets/github.svg");
const linkedInIcon = require("url:../../assets/linkedin.svg");
const apxIcon = require("url:../../assets/apx-logo.png");

customElements.define(
	"information-page",
	class initInformationPage extends HTMLElement {
		connectedCallback() {
			const rpsContainerEl: HTMLElement =
				document.querySelector(".rps-container");
			rpsContainerEl.style.display = "none";

			this.render();
		}

		render() {
			this.innerHTML = `
            <div class="div-container">
				<section class="main-section">
					<p class="brand-slogan">Información</p>
                    <section class="info-section">
                        <p class="brand-info"><b class="yellow-text">RPS</b> es una Web App basada en el desafío final del módulo 6 de la carrera <b>Desarrollador Web Fullstack</b> de <b>apx.school</b>.</p>
                        <div class="rpsapp-container">
                            <img class="rpsapp__img" src="${rpsApp}">
                            <div class="rpsapp__techs">
                            <p class="brand-slogan">Tecnologías y Herramientas</p>
                                <div class="techs-group">
                                    <img title="HTML" class="rpsapp__tech-item" src="${htmlIcon}">
                                    <img title="CSS" class="rpsapp__tech-item" src="${cssIcon}">
                                    <img title="Typescript" class="rpsapp__tech-item" src="${tsIcon}">
                                    <img title="NodeJs" class="rpsapp__tech-item" src="${nodeIcon}">
                                </div>
                                <div class="techs-group">
                                    <img title="Express" class="rpsapp__tech-item" src="${expressIcon}">
                                    <img title="Firebase" class="rpsapp__tech-item" src="${firebaseIcon}">
                                    <img title="Postman" class="rpsapp__tech-item" src="${postmanIcon}">
                                    <img title="Parcel" class="rpsapp__tech-item" src="${parcelIcon}">
                                </div>
                                <div>
                                    <p class="brand-slogan">Links</p>
                                    <a href="https://github.com/tobiasfacello/dwf-m6-desafio" target="blank_"><img title="Repositorio" class="rpsapp__tech-item" src="${githubIcon}"></a>
                                    <a  href="https://www.linkedin.com/in/tobiasfacello/" target="blank_"><img title="LinkeIn" class="rpsapp__tech-item" src="${linkedInIcon}"></a>
                                    <a  href="https://apx.school/profile/d8e5d39a-61a8-45e6-a125-60bd1248ffee" target="blank_"><img title="Perfil personal" class="rpsapp__tech-item" src="${apxIcon}"></a>
                                </div>
                            </div>
                        </div>
                    </section>
            	</section>
            </div>
            `;

			let style = document.createElement("style");
			style.textContent = `
            .div-container {
                width: 100%;
                height: 100vh;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: center;
            }
            .info-section {
                width: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }
            .brand-slogan,
            .brand-info {
                width: 100%;
                margin: 10px 0;
                font-family: "Raleway", sans-serif;
                font-weight: 600;
                font-size: 15px;
                text-align: center;
                color: #EEE;
            }
            .brand-info {
                max-width: 380px;
                width: 100%;
                margin: 20px 0;
                font-weight: 500;
                line-height: 30px;
            }
            @media (min-width: 768px) {
                .brand-info {
                    max-width: 450px;
                }
            }
            .brand-info .yellow-text {
                color: #FFC269;
            }
            .brand-info .white-text {
                color: #FFFFFF;
            }
            @media (min-width: 768px){
                .rpsapp-container {
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: start;
                    gap: 20px;
                }
            }
            .rpsapp__img {
                width: 100%;
                max-width: 300px;
                margin: 20px 0;
            }
            @media (min-width: 768px) {
                .rpsapp__img {
                    max-width: 400px;
                    margin-top: 10px;
                }    
            } 
            
            .rpsapp__techs {
                width: 100%;
                display: flex;
                flex-direction: column;
                justify-content: space-evenly;
                align-items: center;
                gap: 10px;
            }
            .rpsapp__tech-item {
                width: 40px;
                height: 40px;
                margin: 0 10px;
            }
            
            @media (min-width: 960px) {
                .rpsapp__tech-item:hover {
                    background: linear-gradient(190.67deg, #2E2E2E 8.33%, #000000 100%);
                    border: none;
                    border-radius: 5px;
                    padding: 5px;
                }
            }
            `;

			this.appendChild(style);
		}
	}
);
