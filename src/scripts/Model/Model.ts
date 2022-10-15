import DoubleArray from '../Utils/DoubleArray';
import { IVec2 } from '../Utils/IVec2';
import { MessageData, ModelEvent } from './ModelEvent';

export default interface ModelConfig {
	initialSize?: number;
	lineLengthToWin?: number;
}

export default class Model extends EventTarget {

	protected _field: DoubleArray<unknown>;
	protected _lineLengthToWin: number;

	public get size() {
		return this._field.width;
	}

	constructor(config?: ModelConfig) {
		super();

		this._field = new DoubleArray<number>(config?.initialSize ?? 3, config?.initialSize ?? 3);
		this._lineLengthToWin = config?.lineLengthToWin ?? 3;
	}

	protected _increaseFieldSize(): void {
		const oldSize = this.size;
		const newSize = oldSize + 2;
		const newField = new DoubleArray<unknown>(newSize, newSize);

		for (let x = 0; x < oldSize; x++) {
			for (let y = 0; y < oldSize; y++) {
				newField.setAt({ x: x + 1, y: y + 1 }, this._field.getAt({ x, y }));
			}
		}

		this._field = newField;
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
	protected _checkLine({ x, y }: IVec2, start: number, end: number, direction: number): boolean {
		let counter = 0;
		let lastPlayer: unknown;

		if (end - start < this._lineLengthToWin) return false;

		for (let i = start; i < end; i++) {

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

			const value = this._field.getAt(getPosition());

			if (value == undefined) {
				counter = 0;

				continue;
			}

			if (counter == 0) {
				counter++;
				lastPlayer = value;

				continue;
			}

			if (lastPlayer! == value) {
				counter++;
			} else {
				counter = 0;
			}

			if (counter == this._lineLengthToWin) {
				return true;
			}
		}

		return false;
	}

	public sendMessage<T extends ModelEvent>(event: T, data: MessageData[T]): void {
		this.dispatchEvent(new CustomEvent(event, { detail: data }));
	}

	public init(): void {

	}

	public setCellAt(position: IVec2, value: unknown): boolean {
		if (this._field.isInvalidPosition(position)) return false;

		this._field.setAt(position, value);

		return true;
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
					end = Math.max(right, bottom);
					break;
				case 3:
					start = Math.min(left, top);
					end = Math.max(right, bottom);
					break;
			}

			if (this._checkLine(position, start, end, j)) return true;
		}

		return false;
	}
}