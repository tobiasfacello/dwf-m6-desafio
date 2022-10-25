import { Router } from "@vaadin/router";

const root = document.querySelector(".root");

const router = new Router(root);

router.setRoutes([
	{ path: "/", redirect: "/home" },
	{ path: "/home", component: "home-page" },
	{ path: "/auth", component: "auth-page" },
	{ path: "/join", component: "join-page" },
	{ path: "/gameroom/lobby", component: "lobby-page" },
	{ path: "/gameroom/instructions", component: "instructions-page" },
	{ path: "/gameroom/waitroom", component: "waitroom-page" },
	{ path: "/gameroom/play", component: "play-page" },
	{ path: "/gameroom/timeout", component: "timeout-page" },
	{ path: "/gameroom/results", component: "results-page" },
	{ path: "/information", component: "information-page" },
]);
