import DoubleArray from '../../Utils/DoubleArray';
import { IVec2 } from '../../Utils/IVec2';
import IView from '../View/IView';
import { MessageData, ModelEvent } from './ModelEvent';

export interface ModelConfig {
	initialSize?: number;
	lineLengthToWin?: number;
	increasePercent?: number;
}

export enum PlayerId {
	Cross = 'x',
	Circle = 'o'
}

export default class Model {
	protected _field: DoubleArray<PlayerId>;
	protected _lineLengthToWin: number;
	protected _eventTarget: EventTarget;
	protected _filledCells: number;
	protected _increasePercent: number;
	protected _winLine: IVec2[] = [];

	public get needToIncrease() {
		return this._filledCells / (this.size * this.size) >= this._increasePercent;
	}

	public get eventEmitter() {
		return this._eventTarget;
	}

	public get size() {
		return this._field.width;
	}

	constructor(config?: ModelConfig) {
		this._field = new DoubleArray<PlayerId>(config?.initialSize ?? 3, config?.initialSize ?? 3);
		this._lineLengthToWin = config?.lineLengthToWin ?? 3;
		this._eventTarget = new EventTarget();
		this._filledCells = 0;
		this._increasePercent = config?.increasePercent ?? 0.75;
	}

	public increaseFieldSize(): void {
		const oldSize = this.size;
		const newSize = oldSize + 2;
		const newField = new DoubleArray<PlayerId>(newSize, newSize);

		this._field.forEach((value, { x, y }) => {
			newField.setAt({ x: x + 1, y: y + 1 }, value);
		})

		this._field = newField;

		this._sendMessage(ModelEvent.IncreaseField);
	}

	/**
	  * direction = 0 - horizontal line check
	  * 
	  * direction = 1 - vertical line check
	  * 
	  * direction = 2 - main diagonal line check
	  * 
	  * direction = 3 - antidiagonal line  check
	  */
	protected _checkLine({ x, y }: IVec2, start: number, end: number, direction: number): IVec2[] {
		let result: IVec2[] = [];
		let counter = 0;
		let lastPlayer: unknown;
		let isLineFound = false;

		if (end - start < this._lineLengthToWin - 1) return [];

		for (let i = start; i <= end; i++) {

			function getPosition(): IVec2 {
				switch (direction) {
					case 0:
						return { x: x + i, y };
					case 1:
						return { x, y: y + i };
					case 2:
						return { x: x + i, y: y + i };
					default:
						return { x: x + i, y: y - i };
				}
			}
			const position = getPosition();
			const value = this._field.getAt(position);

			const newLine = () => {
				counter = 1;
				result = [];
				result.push(position);
				lastPlayer = value;
			}

			if (value == undefined) {
				if (isLineFound) {
					return result;
				}

				result = [];
				counter = 0;

				continue;
			}

			if (counter == 0) {
				newLine();

				continue;
			}

			if (lastPlayer! == value) {
				counter++;
				result.push(position);
			} else {
				if (isLineFound) {
					return result;
				}

				newLine();
			}

			if (counter == this._lineLengthToWin) {
				isLineFound = true;
			}
		}

		return isLineFound ? result : [];
	}

	protected _sendMessage<T extends ModelEvent>(event: T, data?: MessageData[T]): void {
		this._eventTarget.dispatchEvent(new CustomEvent(event, { detail: data }));
	}

	public on(event: string, callback: EventListenerOrEventListenerObject) {
		this._eventTarget.addEventListener(event, callback);
	}

	public off(event: string, callback: EventListenerOrEventListenerObject) {
		this._eventTarget.removeEventListener(event, callback);
	}

	public subscribeView(view: IView): void {
		const subscribeOnEvent = (event: ModelEvent): void =>
			this.eventEmitter.addEventListener(event, (event) => this.onEvent(view, <CustomEvent>event), { signal: view.abortController.signal });

		subscribeOnEvent(ModelEvent.Init);
		subscribeOnEvent(ModelEvent.UpdateCell);
		subscribeOnEvent(ModelEvent.IncreaseField);
		subscribeOnEvent(ModelEvent.Win);
	}

	public onEvent(view: IView, { type, detail: data }: CustomEvent): void {
		switch (type) {
			case ModelEvent.Init:
				view.onInit(data);
				break;
			case ModelEvent.UpdateCell:
				view.onUpdateCell(data);
				break;
			case ModelEvent.IncreaseField:
				view.onIncreaseField(data);
				break;
			case ModelEvent.Win:
				view.onWin(data)
				break;
		}
	}

	public sendWinMessage(winPlayerId: string): void {
		this._sendMessage(ModelEvent.Win, { winPlayerId, winLine: this._winLine },);
	}

	public init(): void {
		this._sendMessage(ModelEvent.Init, { size: this.size, array: this.getFieldData() });
	}

	public setCellAt(position: IVec2, value: PlayerId): boolean {
		if (this._field.isInvalidPosition(position)) return false;

		this._field.setAt(position, value);

		this._sendMessage(ModelEvent.UpdateCell, { position, value });
		this._filledCells++;

		return true;
	}

	public isCellEmpty(position: IVec2): boolean {
		if (this._field.isInvalidPosition(position)) return false;

		return this._field.getAt(position) == undefined;
	}

	public checkForWin(position: IVec2): boolean {
		if (this._field.isInvalidPosition(position)) return false;
		const { x, y } = position;

		const offset = this._lineLengthToWin - 1;

		const left = Math.max(-x, -offset);
		const top = Math.max(-y, -offset);
		const right = Math.max(this.size - 1 - x, 0);
		const bottom = Math.max(this.size - 1 - y, 0);

		let start = 0;
		let end = 0;

		for (let j = 0; j < 4; j++) {
			switch (j) {
				case 0:
					start = left;
					end = right;
					break;
				case 1:
					start = top;
					end = bottom;
					break;
				case 2:
					start = Math.max(left, top);
					end = Math.min(right, bottom);
					break;
				case 3:
					start = Math.max(left, -bottom);
					end = Math.min(right, Math.abs(top));

					break;
			}
			const line = this._checkLine(position, start, end, j)
			if (line.length > 0) {
				this._winLine = line;

				return true
			};
		}

		return false;
	}

	public getFieldData(): DoubleArray<PlayerId> {
		return this._field.getCopy();
	}
}