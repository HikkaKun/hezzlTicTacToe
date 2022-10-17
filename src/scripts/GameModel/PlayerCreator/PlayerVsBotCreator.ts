import Controller from '../Controller/Controller';
import { PlayerId } from '../Model/Model';
import BotPlayer from '../Player/BotPlayer';
import Player from '../Player/Player';
import PlayerCreator from './PlayerCreator';

export default class PlayerVsBotCreator extends PlayerCreator {
	public createPlayers(controller: Controller): [Player, Player] {
		if (Math.random() < 0.5) {
			return [new BotPlayer(PlayerId.Cross, controller), new Player(PlayerId.Circle, controller)]
		}

		return [new Player(PlayerId.Cross, controller), new BotPlayer(PlayerId.Circle, controller)];
	}
}