import Model, { PlayerId } from '../Model/Model';
import { IVec2 } from '../../Utils/IVec2';

export default class Controller {
	protected readonly _model: Model;
	protected _currentPlayerIndex: number;
	protected _playerIds!: PlayerId[];
	protected _isGameOver: boolean;

	constructor(model: Model) {
		this._model = model;
		this._currentPlayerIndex = 0;
		this._isGameOver = false;
	}

	protected _switchPlayer(): void {
		this._currentPlayerIndex = this._currentPlayerIndex == 0 ? 1 : 0;
	}

	public startGame(): void {
		this._model.init();
	}

	public setPlayerIds(value: PlayerId[]): void {
		this._playerIds = value.slice();
	}

	public onCellClick(position: IVec2, playerId: PlayerId): void {
		if (this._isGameOver) return;
		if (!this.checkCurrentPlayer(playerId)) return;

		const isCellChanged = this._model.setCellAt(position, this._playerIds[this._currentPlayerIndex]);

		if (!isCellChanged) return;

		const isWin = this._model.checkForWin(position);

		if (!isWin) {
			this._switchPlayer();
		} else {
			this._model.sendWinMessage(playerId);
		}
	}

	public checkCurrentPlayer(playerId: string): boolean {
		return this._playerIds && playerId == this._playerIds[this._currentPlayerIndex];
	}

	public getPlayerIndex(): number {
		return this._currentPlayerIndex;
	}
}