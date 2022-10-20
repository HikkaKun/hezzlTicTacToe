import DoubleArray from '../../Utils/DoubleArray';
import { IVec2 } from '../../Utils/IVec2';
import { randomElementFromArray } from '../../Utils/Utils';
import Controller from '../Controller/Controller';
import { PlayerId } from '../Model/Model';
import Player from './Player';

interface Data {
	priority: number
	possibleLength: number
}

export default class BotPlayer extends Player {
	public lineLength = 3;

	constructor(id: PlayerId, controller: Controller) {
		super(id, controller);
	}

	protected _checkLine(array: DoubleArray<PlayerId>, position: IVec2, { x: dx, y: dy }: IVec2, id: PlayerId, startsWith: PlayerId | undefined = undefined): Data | IVec2 {
		const { x, y } = position;
		const lastEmpty = { x, y };
		let i = 0;
		let priority = 0;

		if (startsWith == id) {
			priority++;
		}

		for (i = 1; i <= this.lineLength; i++) {
			position.x += dx;
			position.y += dy;

			if (array.isInvalidPosition(position))
				break;

			const value = array.getAt(position);

			if (value == id) {
				priority++;
			} else if (value == undefined) {
				lastEmpty.x = position.x;
				lastEmpty.y = position.y;
			} else {
				break;
			}
		}

		//returns critical position
		if (priority == this.lineLength - 1) {
			return lastEmpty;
		}

		return { priority, possibleLength: i };
	}

	protected _getPriority(array: DoubleArray<PlayerId>, position: IVec2): number | IVec2 {
		let priority = 0;

		for (let x = -1; x <= 1; x++) {
			for (let y = -1; y <= 1; y++) {
				if (x == 0 && y == 0) continue;

				const myIdData = this._checkLine(array, { x: position.x, y: position.y }, { x, y }, this.id);

				if (myIdData.priority != undefined) {
					priority += (myIdData as Data).priority;
					priority += (myIdData as Data).possibleLength == this.lineLength ? 1 : 0;
				} else {
					return myIdData as IVec2;
				}
				const value = array.getAt(position);
				const otherIdData = this._checkLine(array, { x: position.x, y: position.y }, { x, y }, this.id == PlayerId.Cross ? PlayerId.Circle : PlayerId.Cross, value);

				if (otherIdData.priority != undefined) {
					if (value == undefined) {
						priority += (otherIdData as Data).priority;
						priority += (otherIdData as Data).possibleLength == this.lineLength ? 1 : 0;
					}
				} else {
					return otherIdData as IVec2;
				}
			}
		}

		return priority;
	}

	protected _getAdditionalEnemyPriority(array: DoubleArray<PlayerId>): DoubleArray<number> {
		const result = new DoubleArray<number>(array.width, array.height);

		array.forEach((id, position) => {
			if (id != undefined) {
				result.setAt(position, 0);
			}

			for (let x = -1; x <= 1; x++) {
				for (let y = -1; y <= 1; y++) {
					if (x == 0 && y == 0) continue;
					const data = this._checkLine(array, { x: position.x, y: position.y }, { x, y }, this.id == PlayerId.Cross ? PlayerId.Circle : PlayerId.Cross, id);

					if (data.priority != undefined && data.possibleLength == this.lineLength) {
						const newPos = { x: position.x, y: position.y };

						for (let i = 0; i < this.lineLength; i++) {
							if (array.getAt(newPos) == undefined) {
								const priority = result.getAt(newPos) == undefined ? 0 : result.getAt(newPos);
								result.setAt(newPos, priority! + 1 + (data as Data).priority);
							}

							newPos.x += x;
							newPos.y += y;
						}
					}
				}
			}
		});

		return result;
	}

	public clickOnCell(): void {
		const field = this._controller.getFieldData();

		const empty: IVec2[] = [];
		const all: IVec2[] = [];

		field.forEach((value, position) => {
			if (value == undefined) {
				empty.push(position);
			}

			all.push(position);
		})

		if (empty.length == field.width * field.height) {
			super.clickOnCell({ x: field.width >> 1, y: field.height >> 1 });
		} else {
			let maxPriority = -1;

			const enemyPriority = this._getAdditionalEnemyPriority(field);

			const priorityEmpty = all
				.map((position) => {
					let priority = 0;
					const result = this._getPriority(field, position);

					if (typeof result == 'number') {
						priority = Math.log2(result) + enemyPriority.getAt(position)! * 1.5;
					} else {
						super.clickOnCell(result);
					}

					if (priority > maxPriority) {
						maxPriority = priority;
					}

					return { position, priority }
				})
				.filter(elem => elem.priority == maxPriority);

			const randomPosition = randomElementFromArray(priorityEmpty).position;

			super.clickOnCell(randomPosition);
		}
	}
}