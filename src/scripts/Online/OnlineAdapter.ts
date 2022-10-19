import { Peer, DataConnection } from 'peerjs';
import { PlayerId } from '../GameModel/Model/Model';
import { MessageData, ModelEvent } from '../GameModel/Model/ModelEvent';
import Player from '../GameModel/Player/Player';
import IView from '../GameModel/View/IView';
import DoubleArray from '../Utils/DoubleArray';
import { IVec2 } from '../Utils/IVec2';
import { randomOnlineId } from '../Utils/Utils';

export enum PeerEvent {
	Click = 'click',
	Restart = 'restart',
	Identify = 'identify'
}

export default class OnlineAdapter {
	protected static _peer?: Peer;
	protected static _isInitialization: boolean;
	protected static _connection: DataConnection;

	public static get id() {
		return this._peer ? this._peer.id : "";
	}

	public static idLength = 4;

	public static openCallback?: (id: string) => void;
	public static connectCallback?: () => void;

	public static view: IView | undefined;
	public static onlinePlayer: Player | undefined;
	public static onPeerRestartCallback: () => void;

	protected static _setUpConnection(connection: DataConnection): void {
		this._connection = connection;

		connection.on('open', () => {
			connection.on('data', (data) => {
				this.onMessage(data);
			})

			connection.send(this.id);

			this.connectCallback && this.connectCallback();
		});
	}

	public static initPeer(): void {
		if (this._isInitialization) return;

		this._peer && this._peer.destroy();
		this._peer = new Peer(randomOnlineId(this.idLength));

		this._peer.on("open", this.onOpen, this);
		this._peer.on("error", this.onError, this);
		this._peer.on("connection", (connection) => this._setUpConnection(connection));

		this._isInitialization = true;
	}

	public static connect(id: string): void {
		const connection = this._peer?.connect(id) as DataConnection;

		this._setUpConnection(connection);
	}

	public static sendMessageToPeer<T extends ModelEvent>(type: ModelEvent, data: MessageData[T]): void {
		this._connection && this._connection.send({ type, data });
	}

	public static sendClickEventToHost(position: IVec2): void {
		this._connection && this._connection.send({ type: PeerEvent.Click, position });
	}

	public static sendRestartMessage(): void {
		this._connection && this._connection.send({ type: PeerEvent.Restart });
	}

	public static sendIdentifyMessage(id: PlayerId): void {
		this._connection && this._connection.send({ type: PeerEvent.Identify, data: id });
	}

	protected static onError(error: Error): void {
		if (error.message.endsWith('is taken')) {
			this._isInitialization = false;
			this.initPeer();
		}
	}

	protected static onOpen(id: string): void {
		console.log('Peer ID: ' + id);

		this.openCallback && this.openCallback(id);
	}

	protected static onMessage(message: any): void {
		console.log('Received message:', message);
		if (!this.view && !this.onlinePlayer) return;

		const type = message.type as ModelEvent | PeerEvent;
		const data = message.data;

		switch (type) {
			case ModelEvent.Init:
				const double = new DoubleArray<PlayerId>(data.size, data.size);
				const array = data.array._array;
				double.forEach((value, position) => {
					const { x, y } = position;

					if (array[x][y] != null) {
						double.setAt(position, array[x][y]);
					}
				});

				this.view && this.view.onInit({ size: data.size, array: double });
				break;
			case ModelEvent.UpdateCell:
				this.view && this.view.onUpdateCell(data as MessageData[ModelEvent.UpdateCell]);
				break;
			case ModelEvent.IncreaseField:
				this.view && this.view.onIncreaseField(data as MessageData[ModelEvent.IncreaseField]);
				break;
			case ModelEvent.Win:
				this.view && this.view.onWin(data as MessageData[ModelEvent.Win]);
				break;
			case PeerEvent.Click:
				this.onlinePlayer && this.onlinePlayer.clickOnCell(message.position);
				break;
			case PeerEvent.Restart:
				this.onPeerRestartCallback && this.onPeerRestartCallback();
				break;
			case PeerEvent.Identify:
				this.view && this.view.onIdentify(data);
				break;
		}
	}
}