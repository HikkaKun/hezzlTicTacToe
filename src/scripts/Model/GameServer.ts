import MakeTurnCommand from './Command/MakeTurnCommand';
import { PlayerID } from './PlayerID';
import { IVec2 } from './Utils/IVec2';

export default class GameServer {

	#commands: MakeTurnCommand[] = [];
	#currentPlayer: PlayerID;

	get currentPlayer() {
		return this.#currentPlayer;
	}

	constructor(startPlayer: PlayerID) {
		if (startPlayer == PlayerID.Random) {
			this.#currentPlayer = Math.random() < 0.5 ? PlayerID.First : PlayerID.Secord;
		} else {
			this.#currentPlayer = startPlayer;
		}
	}

	public makeTurn(position: IVec2, playerId: number) {

	}
}