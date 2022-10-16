import Controller from '../Controller/Controller';
import Player from '../Player/Player';
import PlayerCreator from './PlayerCreator';

export default class PlayerVsPlayerCreator extends PlayerCreator {
	public createPlayers(controller: Controller): [Player, Player] {
		return [new Player(this.getRandomId(), controller), new Player(this.getRandomId(), controller)];
	}
}