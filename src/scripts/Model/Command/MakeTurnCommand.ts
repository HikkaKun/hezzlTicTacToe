import { PlayerID } from '../PlayerID';
import { IVec2 } from '../Utils/IVec2';
import Command from './Command';

export default class MakeTurnCommand extends Command {
	#position!: IVec2;
	#playerId!: PlayerID;

	get position() {
		return this.#position;
	}

	get playerId() {
		return this.#playerId;
	}

	public execute(position: IVec2, playerId: PlayerID): void {
		this.#position = Object.freeze(position);
		this.#playerId = playerId;
	}
}