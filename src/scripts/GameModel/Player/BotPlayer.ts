import { IVec2 } from '../../Utils/IVec2';
import { randomElementFromArray } from '../../Utils/Utils';
import Controller from '../Controller/Controller';
import { PlayerId } from '../Model/Model';
import Player from './Player';

export default class BotPlayer extends Player {
	constructor(id: PlayerId, controller: Controller) {
		super(id, controller);
	}

	public clickOnCell(): void {
		const field = this._controller.getFieldData();

		const empty: IVec2[] = [];

		field.forEach((value, position) => {
			if (value == undefined) {
				empty.push(position);
			}
		})

		const randomPosition = randomElementFromArray(empty);

		super.clickOnCell(randomPosition);
	}
}