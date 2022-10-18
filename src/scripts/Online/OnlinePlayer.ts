import { Peer, DataConnection } from 'peerjs';
import { randomOnlineId } from '../Utils/Utils';

export default class OnlinePlayer {
	protected static _peer?: Peer;
	protected static _isInitialization: boolean;
	protected static _connection: DataConnection;

	public static get id() {
		return this._peer ? this._peer.id : "";
	}

	public static idLength = 4;

	public static openCallback?: (id: string) => void;

	public static initPeer(): void {
		if (this._isInitialization) return;

		this._peer && this._peer.destroy();
		this._peer = new Peer(randomOnlineId(this.idLength));

		this._peer.on("open", this.onOpen, this);
		this._peer.on("error", this.onError, this);

		this._isInitialization = true;
	}

	public static connect(id: string): void {
		const connection = this._peer?.connect(id) as DataConnection;

		connection.on('open', () => {
			console.log('connectd!');
		});
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
}