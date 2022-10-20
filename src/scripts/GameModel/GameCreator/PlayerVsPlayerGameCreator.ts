import Controller from '../Controller/Controller';
import Model, { ModelConfig, PlayerId } from '../Model/Model';
import Player from '../Player/Player';
import IView from '../View/IView';
import GameCreator from './GameCreator';

export default class PlayerVsPlayerGameCreator extends GameCreator {
	private _view?: IView;
	private _config?: ModelConfig;
	private _players?: [Player, Player];

	public createGame(view: IView, config?: ModelConfig): [Player, Player] {
		this._config = this._config ?? config;
		const model = new Model(this._config);
		const controller = new Controller(model);
		const players: [Player, Player] = this._players ?? [new Player(PlayerId.Cross, controller), new Player(PlayerId.Circle, controller)];

		if (this._players) {
			this._players.forEach(p => p.controller = controller);
		}

		view.unsubscribe();
		model.subscribeView(view);

		view.cellPressCallback = (x: number, y: number) => players[controller.getPlayerIndex()].clickOnCell({ x, y });

		controller.setPlayerIds([players[0].id, players[1].id]);
		controller.startGame();

		this._players = players;
		this._view = view;

		return players;
	}

	public restart(): void {
		this._view && this.createGame(this._view);
	}
}