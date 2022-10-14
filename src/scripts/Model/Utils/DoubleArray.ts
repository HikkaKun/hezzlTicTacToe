import { IVec2 } from './IVec2';

export default class DoubleArray<T> {

	#array: (T | undefined)[];

	#width: number;
	#height: number;
	#defaultValue: T | undefined;

	public get defaultValue() {
		return this.#defaultValue;
	}

	public get width() {
		return this.#width;
	}

	public set width(newWidth) {
		if (newWidth == this.width) return;

		const oldWidth = this.#width;
		const oldArray = this.#array;
		const difference = Math.abs(newWidth - oldWidth);
		const newArray: typeof oldArray = [];

		newArray.length = this.height * newWidth;
		newArray.fill(this.defaultValue);

		if (newWidth < oldWidth) {
			for (let i = 0; i < newArray.length; i++) {
				const offset = Math.floor(i / newWidth) * difference;

				newArray[i] = this.#array[i + offset];
			}
		} else {
			for (let i = 0; i < this.#array.length; i++) {
				const offset = Math.floor(i / oldWidth) * difference;

				newArray[i + offset] = this.#array[i];
			}
		}

		this.#array = newArray;
		this.#width = newWidth;
	}

	public get height() {
		return this.#height;
	}

	public set height(newHeight) {
		if (newHeight == this.height) return;

		this.#array.length = this.width * newHeight;
		this.#array.fill(this.defaultValue, this.height * this.width);

		this.#height = newHeight;
	}

	constructor(width: number, height: number, defaultValue: T | undefined = undefined, arr?: (T | undefined)[]) {
		this.#width = width;
		this.#height = height;
		this.#defaultValue = defaultValue;

		this.#array = arr?.slice() ?? [];
		this.#array.length = width * height;
		!arr && this.#array.fill(this.defaultValue);
	}

	public isInvalidPosition(position: IVec2): boolean {
		const { x, y } = position;

		return x < 0 || x >= this.width || y < 0 || y >= this.height;
	}

	/**
	 * Returns -1 if postiion is outside of the bounds of the field
	 */
	public convertPositionToIndex(position: IVec2): number {
		if (this.isInvalidPosition(position))
			return -1;

		return position.x + position.y * this.#width;
	}

	/**
	 * Returns null if index is outside of the bounds of the array
	 */
	public convertIndexToPosition(index: number): IVec2 | null {
		if (index < 0 || index > this.#array.length)
			return null;

		return { x: Math.floor(index % this.width), y: Math.floor(index / this.width) };
	}

	public getAt(position: IVec2): T | undefined {
		if (this.isInvalidPosition(position))
			return undefined;

		return this.#array[this.convertPositionToIndex(position)];
	}

	public setAt(position: IVec2, item: T | undefined): void {
		if (this.isInvalidPosition(position))
			return;

		this.#array[this.convertPositionToIndex(position)] = item;
	}

	/**
	 * Returns copy of this DoubleArray
	 * 
	 * Note: This assigns objects/arrays by reference instead of by value
	 * 
	 */
	public copy(): DoubleArray<T> {
		return new DoubleArray<T>(this.width, this.height, this.defaultValue, this.#array);
	}
}