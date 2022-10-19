import OnlineAdapter from '../../Online/OnlineAdapter';
import OnlineViewAdapter from '../../Online/OnlineViewAdapter';
import Controller from '../Controller/Controller';
import Model, { ModelConfig, PlayerId } from '../Model/Model';
import Player from '../Player/Player';
import IView from '../View/IView';
import GameCreator from './GameCreator';

export default class OnlineVsPlayerGameCreator extends GameCreator {
	protected _players?: [Player, Player];
	protected _hostIndex?: number;
	protected _view?: IView;
	protected _onlineView?: IView;

	public createGame(view: IView, config?: ModelConfig | undefined): [Player, Player] {
		const model = new Model(config);
		const controller = new Controller(model);
		const players: [Player, Player] = this._players ?? [new Player(PlayerId.Cross, controller), new Player(PlayerId.Circle, controller)];

		this._hostIndex = Math.random() < 0.5 ? 0 : 1;

		const onlineView = this._onlineView ?? new OnlineViewAdapter();

		view.unsubscribe();
		onlineView.unsubscribe();
		model.subscribeView(view);
		model.subscribeView(onlineView);


		const host = players[this._hostIndex];
		const peer = players[1 - this._hostIndex];

		OnlineAdapter.onlinePlayer = peer;
		OnlineAdapter.onPeerRestartCallback = () => this.restart();

		view.cellPressCallback = (x: number, y: number) => {
			host.clickOnCell({ x, y });
		};

		controller.setPlayerIds([players[0].id, players[1].id]);
		controller.startGame();

		this._view = view;
		this._view.onIdentify(host.id);
		OnlineAdapter.sendIdentifyMessage(peer.id);

		return players;
	}

	public restart(): void {
		this._view && this.createGame(this._view);
	}

}