import 'phaser';
import { IVec2 } from '../../Utils/IVec2';
import IView from '../../GameModel/View/IView';
import { SceneKeys } from './SceneKeys';
import Cell from '../GameObjects/Cell';
import Controller from '../../GameModel/Controller/Controller';
import { PlayerId } from '../../GameModel/Model/Model';
import { MessageData, ModelEvent } from '../../GameModel/Model/ModelEvent';
import Button, { addGameButton, toggleButtons, toggleButtonsFancy } from '../GameObjects/Button';
import { ImageKeys } from '../Keys/ImageKeys';

export interface TicTacToeFieldInitData {
	controller: Controller;
	xOffset: number;
	yOffset: number;
	maxFieldSize?: number;
}

export default class TicTacToeField extends Phaser.Scene implements IView {
	protected _maxFieldSize!: number;
	protected _xOffset!: number;
	protected _yOffset!: number;
	protected _isOn: boolean = false;

	public buttons: Button[] = [];
	public size!: number;
	public cells: Cell[] = [];
	public currentPlayerText!: Phaser.GameObjects.Text;
	public multiplayerIdentifier!: Phaser.GameObjects.Text;

	public abortController: AbortController;
	public cellPressCallback: (x: number, y: number) => void;

	public restartCallback?: () => void;
	public offCallback?: () => void;

	public get cellSize() {
		return this._maxFieldSize / this.size;
	}

	public get renderCellSize() {
		return this.cellSize * 0.9;
	}

	constructor() {
		super(SceneKeys.TicTacToeField);

		this.abortController = new AbortController();
		this.cellPressCallback = (x: number, y: number) => console.log(`$Pressed at (${x}, ${y})`);
	}

	protected _getCellPosition(x: number, y: number): [number, number] {
		x = this._xOffset + (x - (this.size / 2)) * this.cellSize + this.cellSize / 2;
		y = this._yOffset + (y - (this.size / 2)) * this.cellSize + this.cellSize / 2;

		return [x, y];
	}

	protected _createCell(x: number, y: number, initialState?: PlayerId): Cell {
		const fieldX = x;
		const fieldY = y;

		[x, y] = this._getCellPosition(x, y);

		const cell = new Cell(this, x, y);
		cell.setCellSize(0);

		cell.fieldX = fieldX;
		cell.fieldY = fieldY;

		cell.callback = (x: number, y: number) => this.cellPressCallback && this.cellPressCallback(x, y);

		this.add.existing(cell);
		this.cells.push(cell);

		if (initialState != undefined) {
			this._updateCell(cell, initialState);
		}

		return cell;
	}

	protected _updateCell(cell: Cell, value: PlayerId): void {
		switch (value) {
			case PlayerId.Cross:
				cell.setCross();
				break;
			case PlayerId.Circle:
				cell.setCircle();
				break;
		}
	}

	public init({ xOffset = 0, yOffset = 0, maxFieldSize = 320 }: TicTacToeFieldInitData) {
		this._maxFieldSize = maxFieldSize;
		this._xOffset = xOffset;
		this._yOffset = yOffset;
	}

	public create() {
		const restart = addGameButton(this, 320, 320 + this._maxFieldSize / 2 + 30, ImageKeys.Button, () => {
			this.restartCallback && this.restartCallback();
		}, 'Restart');

		const back = addGameButton(this, 320, 320 + this._maxFieldSize / 2 + 80, ImageKeys.Button, () => this.off(), 'Back');

		this.currentPlayerText = this.add.text(320, 120, 'Turn of []', { fontFamily: 'monogram', fontSize: "32px" }).setOrigin(0.5).setVisible(false);
		this.multiplayerIdentifier = this.add.text(320, 95, 'You are []', { fontFamily: 'monogram', fontSize: "32px" }).setOrigin(0.5).setVisible(false);

		this.buttons.push(restart, back);
		toggleButtons(this.buttons, false);
	}

	public resizeField(): void {
		for (const cell of this.cells) {
			const [x, y] = this._getCellPosition(cell.fieldX, cell.fieldY);
			const size = cell.size;

			const ease = Phaser.Math.Easing.Sine.Out;

			this.tweens.add({
				targets: cell,
				x: x,
				y: y,
				onUpdate: (tween, target: Cell) => { target.setCellSize(size + (this.renderCellSize - size) * ease(tween.progress)) },
				duration: 250,
				ease
			})
		}
	}

	public off(): void {
		toggleButtonsFancy(this, this.buttons, false);

		this.currentPlayerText.setVisible(false);
		this.multiplayerIdentifier.setVisible(false);

		this.tweens.add({
			targets: this.cells,
			y: '-=' + 100,
			alpha: 0,
			duration: 200,
			delay: 100,
			ease: Phaser.Math.Easing.Back.In,
			onComplete: () => {
				this._isOn = false;
				this.offCallback && this.offCallback()
			}
		})
	}

	public unsubscribe(): void {
		this.abortController.abort();

		this.abortController = new AbortController();
	}

	public onInit({ size, array }: MessageData[ModelEvent.Init]): void {
		for (const cell of this.cells) {
			cell.destroy();
		}

		this.cells = [];

		this.size = size;

		let whoTurn = 0;

		array.forEach((value, { x, y }) => {
			const cell = this._createCell(x, y, value);

			if (value == PlayerId.Cross) {
				whoTurn++;
			}
			else if (value == PlayerId.Circle) {
				whoTurn--;
			}

			value != undefined && this._updateCell(cell, value);
		})

		this.currentPlayerText.setVisible(true);
		this.currentPlayerText.text = `Turn of [${whoTurn == 0 ? 'X' : 'O'}]`

		if (!this._isOn) {
			toggleButtonsFancy(this, this.buttons, true);
			this._isOn = true;
		}

		this.resizeField();
	}

	public onUpdateCell({ position, value }: MessageData[ModelEvent.UpdateCell]): void {
		const { x, y } = position;
		const cell = this.cells.find(c => c.fieldX == x && c.fieldY == y);

		if (!cell) return;

		this.currentPlayerText.text = `Turn of [${value == PlayerId.Cross ? 'O' : 'X'}]`

		this._updateCell(cell, value);
	}

	public onIncreaseField(): void {
		for (let i = 0; i < this.size; i++) {
			this._createCell(-1, i);
			this._createCell(i, -1);
			this._createCell(this.size, i);
			this._createCell(i, this.size);
		}

		this._createCell(-1, -1);
		this._createCell(-1, this.size);
		this._createCell(this.size, -1);
		this._createCell(this.size, this.size);

		for (const cell of this.cells) {
			cell.fieldX++;
			cell.fieldY++;
		}

		this.size += 2;
		this.resizeField();
	}

	public onWin({ winPlayerId, winLine }: MessageData[ModelEvent.Win]): void {
		const winCells = this.cells
			.filter(cell => winLine.find((pos) => (pos.x == cell.fieldX && pos.y == cell.fieldY)))
			.sort((a, b) => a.fieldX - b.fieldX == 0 ? a.fieldY - b.fieldY : a.fieldX - b.fieldX);

		const otherCells = this.cells
			.filter(cell => !winCells.includes(cell));

		for (const cell of winCells) {
			this.children.bringToTop(cell);
		}

		this.tweens.addCounter({
			from: 255,
			to: 200,
			duration: 500,
			onUpdate: (tween) => {
				for (const cell of otherCells) {
					const value = Math.floor(tween.getValue());
					cell.setTint(Phaser.Display.Color.GetColor(value, value, value));
				}
			}
		});

		this.tweens.add({
			targets: winCells,
			y: '-=' + this.cellSize / 2,
			duration: 500,
			delay: (target: Cell) => winCells.indexOf(target) * 100,
			ease: Phaser.Math.Easing.Sine.Out,
			yoyo: true,
		});
	}

	public onIdentify(data: PlayerId): void {
		this.multiplayerIdentifier.setVisible(true).text = `You are [${data == PlayerId.Cross ? 'X' : 'O'}]`;
	}
}