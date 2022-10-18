import { ModelConfig } from '../Model/Model';
import Player from '../Player/Player';
import IView from '../View/IView';

export default abstract class GameCreator {
	public abstract createGame(view: IView, config?: ModelConfig): [Player, Player];

	public abstract restart(): void;
}