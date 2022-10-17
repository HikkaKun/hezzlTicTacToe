import Controller from '../Controller/Controller';
import { PlayerId } from '../Model/Model';
import BotPlayer from '../Player/BotPlayer';
import Player from '../Player/Player';
import PlayerCreator from './PlayerCreator';

export default class PlayerVsBotCreator extends PlayerCreator {
	public createPlayers(controller: Controller): [Player, Player] {
		return [new Player(PlayerId.Cross, controller), new BotPlayer(PlayerId.Circle, controller)];
	}
}