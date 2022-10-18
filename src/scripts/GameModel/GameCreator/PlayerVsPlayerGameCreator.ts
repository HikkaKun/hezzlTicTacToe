import Controller from '../Controller/Controller';
import Model, { ModelConfig, PlayerId } from '../Model/Model';
import Player from '../Player/Player';
import IView from '../View/IView';
import GameCreator from './GameCreator';

export default class PlayerVsPlayerGameCreator extends GameCreator {
	public createGame(view: IView, config?: ModelConfig): [Player, Player] {
		const model = new Model(config);
		const controller = new Controller(model);
		const players: [Player, Player] = [new Player(PlayerId.Cross, controller), new Player(PlayerId.Circle, controller)];

		model.subscribeView(view);

		view.cellPressCallback = (x: number, y: number) => players[controller.getPlayerIndex()].clickOnCell({ x, y });

		controller.setPlayerIds([players[0].id, players[1].id]);
		controller.startGame();

		return players;
	}
}