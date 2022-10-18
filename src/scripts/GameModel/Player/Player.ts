import Controller from '../Controller/Controller';
import { IVec2 } from '../../Utils/IVec2';
import { PlayerId } from '../Model/Model';

export default class Player {
	protected _controller: Controller;

	public id: PlayerId;

	public set controller(value: Controller) {
		this._controller = value;
	}

	constructor(id: PlayerId, controller: Controller) {
		this._controller = controller;
		this.id = id;
	}

	public clickOnCell(position?: IVec2): void {
		position && this._controller.onCellClick(position, this.id);
	}
}