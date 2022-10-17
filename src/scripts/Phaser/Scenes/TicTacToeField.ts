import 'phaser';
import { IVec2 } from '../../Utils/IVec2';
import IView from '../../GameModel/View/IView';
import { SceneKeys } from './SceneKeys';
import Cell from '../GameObjects/Cell';
import Controller from '../../GameModel/Controller/Controller';
import { PlayerId } from '../../GameModel/Model/Model';

export interface TicTacToeFieldInitData {
	controller: Controller;
	xOffset: number;
	yOffset: number;
	maxFieldSize?: number;
}

export default class TicTacToeField extends Phaser.Scene implements IView {
	protected _maxFieldSize!: number;
	protected _size!: number;
	protected _xOffset!: number;
	protected _yOffset!: number;
	protected _cells: Cell[] = [];

	public abortController: AbortController;
	public cellPressCallback?: (x: number, y: number) => void;

	constructor() {
		super(SceneKeys.TicTacToeField);

		this.abortController = new AbortController();
	}

	protected _createCell(x: number, y: number): void {
		const cellSize = this._maxFieldSize / this._size;

		const fieldX = x;
		const fieldY = y;

		x = this._xOffset + (x - (this._size / 2)) * cellSize + cellSize / 2;
		y = this._yOffset + (y - (this._size / 2)) * cellSize + cellSize / 2;

		const cell = new Cell(this, x, y);
		cell.setCellSize(cellSize * 0.9);

		cell.fieldX = fieldX;
		cell.fieldY = fieldY;

		cell.callback = (x: number, y: number) => this.cellPressCallback && this.cellPressCallback(x, y);

		this.add.existing(cell);
		this._cells.push(cell);
	}

	public init({ xOffset = 0, yOffset = 0, maxFieldSize = 320 }: TicTacToeFieldInitData) {
		this._maxFieldSize = maxFieldSize;
		this._xOffset = xOffset;
		this._yOffset = yOffset;
	}

	public create() { }

	public unsubscribe(): void {
		this.abortController.abort();
	}

	public onInit(size: number): void {
		this._size = size;

		for (let x = 0; x < size; x++) {
			for (let y = 0; y < size; y++) {
				this._createCell(x, y);
			}
		}
	}

	public onUpdateCell({ x, y }: IVec2, value: PlayerId): void {
		const cell = this._cells.find(c => c.fieldX == x && c.fieldY == y);

		if (!cell) return;

		switch (value) {
			case PlayerId.Cross:
				cell.setCross();
				break;
			case PlayerId.Circle:
				cell.setCircle();
				break;
		}
	}

	public onIncreaseField(): void {
		throw new Error('Method not implemented.');
	}

	public onWin(winPlayerId: string): void {
		console.log(`Player '${winPlayerId}' has won!`);
	}
}