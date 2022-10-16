import Controller from '../Controller/Controller';
import BotPlayer from '../Player/BotPlayer';
import Player from '../Player/Player';
import PlayerCreator from './PlayerCreator';

export default class PlayerVsBotCreator extends PlayerCreator {
	public createPlayers(controller: Controller): [Player, Player] {
		return [new Player(this.getRandomId(), controller), new BotPlayer(this.getRandomId(), controller)];
	}
}