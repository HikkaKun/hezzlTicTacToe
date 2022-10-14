import { PlayerID } from './PlayerID';
import DoubleArray from './Utils/DoubleArray';
import { IVec2 } from './Utils/IVec2';

export type Cell = null | PlayerID;

export default class GameField {

	#field: DoubleArray<Cell>;
	#centerOffset: number;

	public get field() {
		return this.#field;
	}

	/**
	 * Когда размер поля увеличивается, то создается проблема -
	 * клетки из предыдущего состояния смещаются на один вправо и вниз.
	 * Поэтому нужно сохранять смещение для сохранения правильных
	 * позиций при передаче позиций в команду. В моей реализации
	 * смещение идет от центра изначального поля.
	 */
	public get centerOffset() {
		return this.#centerOffset;
	}

	public get size() {
		return this.#field.width;
	}

	constructor(initialSize = 3) {
		this.#field = new DoubleArray<Cell>(initialSize, initialSize, null);
		this.#centerOffset = -initialSize >> 1;
	}

	/**
	 * Увеличивает размер поля на 2 и 
	 * добавляет пустые клетки вокруг
	 */
	public increaseFieldSize(): void {
		const { width: oldSize } = this.#field;
		this.#field.width += 2;
		this.#field.height += 2;

		for (let y = oldSize; y > 0; y--) {
			for (let x = oldSize; x > 0; x--) {
				const cell = this.#field.getAt({ x: x - 1, y: y - 1 }) as Cell;
				this.#field.setAt({ x, y }, cell);
			}
		}

		for (let i = 0; i < oldSize; i++) {
			this.#field.setAt(this.#field.convertIndexToPosition(i) as IVec2, this.#field.defaultValue);
			this.#field.setAt(this.#field.convertIndexToPosition(i * this.#field.width) as IVec2, this.#field.defaultValue);
		}

		this.#centerOffset--;
	}

	public setCellAt(position: IVec2, cell: Cell): void {
		this.#field.setAt(position, cell);
	}

	public getCellAt(position: IVec2): Cell | undefined {
		return this.#field.getAt(position);
	}
}