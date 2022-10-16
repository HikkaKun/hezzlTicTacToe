import Model from '../Model/Model';
import { IVec2 } from '../Utils/IVec2';

export default class Controller {
	protected readonly _model: Model;
	protected _currentPlayerIndex: number;
	protected readonly _playerIds: string[];
	protected _isGameOver: boolean;

	constructor(model: Model, playerIds: string[]) {
		this._model = model;
		this._currentPlayerIndex = 0;
		this._playerIds = playerIds.slice();
		this._isGameOver = false;
	}

	protected _switchPlayer(): void {
		this._currentPlayerIndex = this._currentPlayerIndex == 0 ? 1 : 0;
	}

	public onCellClick(position: IVec2, playerId: string): void {
		if (this._isGameOver) return;
		if (!this.checkCurrentPlayer(playerId)) return;

		const isCellChanged = this._model.setCellAt(position, this._currentPlayerIndex);

		if (!isCellChanged) return;

		const isWin = this._model.checkForWin(position);

		if (!isWin) {
			this._switchPlayer();
		} else {
			this._model.sendWinMessage(playerId);
		}
	}

	public checkCurrentPlayer(playerId: string) {
		return playerId == this._playerIds[this._currentPlayerIndex];
	}
}