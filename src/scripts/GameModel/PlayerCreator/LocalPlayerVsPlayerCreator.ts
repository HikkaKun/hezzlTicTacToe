import Controller from '../Controller/Controller';
import Player from '../Player/Player';
import PlayerCreator from './PlayerCreator';
import { PlayerId } from '../Model/Model';

export default class LocalPlayerVsPlayerCreator extends PlayerCreator {
	public createPlayers(controller: Controller): [Player, Player] {
		return [new Player(PlayerId.Cross, controller), new Player(PlayerId.Circle, controller)];
	}
}