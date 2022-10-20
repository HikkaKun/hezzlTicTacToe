import Controller from '../Controller/Controller';
import Model, { ModelConfig, PlayerId } from '../Model/Model';
import BotPlayer from '../Player/BotPlayer';
import Player from '../Player/Player';
import IView from '../View/IView';
import GameCreator from './GameCreator';

export default class BotVsPlayerGameCreator extends GameCreator {
	protected _view?: IView;
	protected _config?: ModelConfig;
	protected _players?: [Player, Player];
	protected _isPlayerFirst?: boolean;

	/**
	 * Sets the turn order of the player.
	 * 
	 * PlayerId.Cross - first
	 * 
	 * PlayerId.Circle - second
	 * 
	 * random - random
	 */
	public setPlayerId(id: PlayerId | 'random'): void {
		if (id == 'random') {
			if (!this._players) return;

			const newIsPlayerFirst = Math.random() < 0.5 ? true : false;

			if (newIsPlayerFirst != this._isPlayerFirst) {
				[this._players[0], this._players[1]] = [this._players[1], this._players[0]];
				this._players[0].id = PlayerId.Cross;
				this._players[1].id = PlayerId.Circle;

				this._isPlayerFirst = newIsPlayerFirst;
			}
		} else {
			this._isPlayerFirst = id == PlayerId.Cross;
		}
	}

	public createGame(view: IView, config?: ModelConfig): [Player, Player] {
		this._config = this._config ?? config;
		const model = new Model(this._config);
		const controller = new Controller(model);

		const isPlayerFirst = this._isPlayerFirst ?? Math.random() < 0.5;

		const players: [Player, Player] = this._players ? this._players :
			isPlayerFirst
				? [new Player(PlayerId.Cross, controller), new BotPlayer(PlayerId.Circle, controller)]
				: [new BotPlayer(PlayerId.Cross, controller), new Player(PlayerId.Circle, controller)]

		if (this._players) {
			this._players.forEach(p => p.controller = controller);
		}

		view.unsubscribe();
		model.subscribeView(view);

		controller.setPlayerIds([players[0].id, players[1].id]);

		view.cellPressCallback = (x: number, y: number) => {
			const human = players[isPlayerFirst ? 0 : 1];
			const bot = players[isPlayerFirst ? 1 : 0];

			if (controller.checkCurrentPlayer(human.id)) {
				controller.onCellClick({ x, y }, human.id);

				if (controller.checkCurrentPlayer(bot.id)) {
					bot.clickOnCell();
				}
			}
		};

		if (!isPlayerFirst) {
			players[0].clickOnCell();
		}

		controller.startGame();

		this._players = players;
		this._view = view;
		this._isPlayerFirst = isPlayerFirst

		return players;
	}

	public restart(): void {
		this._view && this.createGame(this._view);
	}
}