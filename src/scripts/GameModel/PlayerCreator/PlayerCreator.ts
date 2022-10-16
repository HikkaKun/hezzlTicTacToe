import Controller from '../Controller/Controller';
import Player from '../Player/Player';

export default abstract class PlayerCreator {
	public abstract createPlayers(controller: Controller): [Player, Player];
}