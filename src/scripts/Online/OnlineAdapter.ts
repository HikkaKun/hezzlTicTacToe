import { Peer, DataConnection } from 'peerjs';
import { MessageData, ModelEvent } from '../GameModel/Model/ModelEvent';
import { IVec2 } from '../Utils/IVec2';
import { randomOnlineId } from '../Utils/Utils';

interface DataType {
	type: ModelEvent;
	data: unknown;
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
	public static onPeerClick?: (position: IVec2) => void;

	protected static _setUpConnection(connection: DataConnection): void {
		connection.on('open', () => {
			connection.on('data', (data) => {
				this.onMessage(data as DataType);
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

	public static sendMessage(data: DataType): void {

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

	protected static onMessage({ type, data }: DataType): void {
		console.log(data);
	}
}