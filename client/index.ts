import { state } from "./state";
import "../server/router";

//* Pages
import "./pages/home/index";
import "./pages/auth/index";
import "./pages/join/index";
import "./pages/lobby/index";
import "./pages/instructions/index";
import "./pages/waitroom/index";
import "./pages/play/index";
import "./pages/timeout/index";
import "./pages/results/index";
import "./pages/information/index";

//* Components
import "./components/header-comp";
import "./components/join-form";
import "./components/auth-form";
import "./components/title-comp";
import "./components/emphasize-text";
import "./components/small-text";
import "./components/user-profile";
import "./components/modal-comp";
import "./components/modal-text";
import "./components/notification-comp";
import "./components/btn-comp";
import "./components/timer-comp";
import "./components/hand-comp";
import "./components/scoreboard-comp";

async function beforeUnloadUpdates() {
	const secureId: string = state.getRoomAccessData().secureId;
	const userAuthId: string = state.getUserAuthData().userId;
	state.setRealtimeConnection(false);
	state.setPlayersSelections(false);
	await state.updatePlayerStatus(secureId, userAuthId, "offline");
	await state.updatePlayerChoice(secureId, userAuthId, "");
	state.setState(state.data);
}

function main() {
	window.addEventListener("beforeunload", async () => {
		await beforeUnloadUpdates();
	});
}

main();
