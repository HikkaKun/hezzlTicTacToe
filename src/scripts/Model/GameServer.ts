import Command from './Command/Command';
import { PlayerID } from './PlayerID';
import { IVec2 } from './Utils/IVec2';

export default class GameServer {

	#commands: Command[] = [];
	#currentPlayer: PlayerID;

	get currentPlayer() {
		return this.#currentPlayer;
	}

	constructor(startPlayer: PlayerID | "random") {
		if (startPlayer == "random") {
			this.#currentPlayer = Math.random() < 0.5 ? PlayerID.First : PlayerID.Secord;
		} else {
			this.#currentPlayer = startPlayer;
		}
	}

	public makeTurn(position: IVec2, playerId: number) {

	}
}