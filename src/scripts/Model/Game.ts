import GameField from './GameField';
import { PlayerID } from './PlayerID';
import { IVec2 } from './Utils/IVec2';

export interface GameConfig {
	size?: number;
	startPlayer?: PlayerID | "random",
}

export default class Game {

	#field: GameField;

	public currentPlayer: PlayerID;

	constructor(config: GameConfig) {
		const startPlayer = config.startPlayer ?? "random";

		if (startPlayer == "random") {
			this.currentPlayer = Math.random() < 0.5 ? PlayerID.First : PlayerID.Secord;
		} else {
			this.currentPlayer = startPlayer;
		}

		this.#field = new GameField(config.size);

		this.init();
	}

	public init(): void {

	}

	public isInvalidPosition(position: IVec2): boolean {
		return this.#field.isInvalidPosition(position);
	}

	public makeTurn(position: IVec2): void {
		if (this.#field.isInvalidPosition(position)) return;

		const cell = this.#field.getCellAt(position);

		if (cell == null) {
			this.#field.setCellAt(position, this.currentPlayer);
		}
	}

	public switchPlayer(): PlayerID {
		this.currentPlayer = this.currentPlayer == PlayerID.First ? PlayerID.Secord : PlayerID.First;

		return this.currentPlayer;
	}
}