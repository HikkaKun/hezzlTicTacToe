import Controller from '../Controller/Controller';
import Player from '../Player/Player';
import PlayerCreator from './PlayerCreator';

export default class LocalPlayerVsPlayerCreator extends PlayerCreator {
	public createPlayers(controller: Controller): [Player, Player] {
		return [new Player('x', controller), new Player('o', controller)];
	}
}