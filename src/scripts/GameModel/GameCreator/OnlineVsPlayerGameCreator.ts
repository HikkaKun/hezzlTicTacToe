import OnlineViewAdapter from '../../Online/OnlineViewAdapter';
import Controller from '../Controller/Controller';
import Model, { ModelConfig, PlayerId } from '../Model/Model';
import OnlinePlayer from '../Player/OnlinePlayer';
import Player from '../Player/Player';
import IView from '../View/IView';
import GameCreator from './GameCreator';

export default class OnlineVsPlayerGameCreator extends GameCreator {
	private _players?: [Player, Player];

	public createGame(view: IView, config?: ModelConfig | undefined): [Player, Player] {
		const model = new Model(config);
		const controller = new Controller(model);
		const players: [Player, Player] = this._players ?? [new OnlinePlayer(PlayerId.Cross, controller), new Player(PlayerId.Circle, controller)];

		if (Math.random() < 0.5) {
			[players[0], players[1]] = [players[1], players[0]];

			players[0].id = PlayerId.Cross;
			players[1].id = PlayerId.Circle;
		}

		const onlineView = new OnlineViewAdapter();

		view.unsubscribe();
		model.subscribeView(view);
		model.subscribeView(onlineView);

		const host = players.find(player => !(player instanceof OnlinePlayer)) as Player;
		const peer = players[1 - players.indexOf(host)];

		view.cellPressCallback = (x: number, y: number) => {
			host.clickOnCell({ x, y });
		};


		controller.setPlayerIds([players[0].id, players[1].id]);
		controller.startGame();

		return players;
	}
	public restart(): void {
		throw new Error('Method not implemented.');
	}

}