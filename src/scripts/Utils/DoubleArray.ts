import { IVec2 } from './IVec2';

export default class DoubleArray<T> {
	protected _width: number;
	protected _height: number;

	public get width() {
		return this._width;
	}

	public set width(newWidth) {
		this._width = newWidth;

		for (let i = 0; i < this._array.length; i++) {
			this._array[i].length = newWidth;
		}
	}

	public get height() {
		return this._height;
	}

	public set height(newHeight) {
		this._height = newHeight;

		this._array.length = newHeight;
	}

	protected _array: (T | undefined)[][];

	constructor(width: number, height: number) {
		this._width = width;
		this._height = height;

		const array = [];

		for (let i = 0; i < height; i++) {
			const row: (T | undefined)[] = [];
			row.length = width;

			array.push(row);
		}

		this._array = array;
	}

	public isInvalidPosition(position: IVec2): boolean {
		const { x, y } = position;

		return x < 0 || x >= this.width || y < 0 || y >= this.height;
	}

	public setAt(position: IVec2, value: (T | undefined)): void {
		this._array[position.y][position.x] = value;
	}

	public getAt(position: IVec2): (T | undefined) {
		return this._array[position.y][position.x];
	}

	public getCopy(): DoubleArray<T> {
		const newArr = new DoubleArray<T>(this.width, this.height);

		this.forEach((value, position) => {
			newArr.setAt(position, value);
		});

		return newArr;
	}

	public forEach(callback: (value: T | undefined, position: IVec2) => unknown): void {
		for (let x = 0; x < this.width; x++) {
			for (let y = 0; y < this.height; y++) {
				const position = { x, y };
				callback(this.getAt(position), position);
			}
		}
	}
}