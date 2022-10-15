import Controller from '../Controller/Controller';
import { IVec2 } from '../Utils/IVec2';

export default class Player {
	protected _controller: Controller;
	protected readonly _id: string;

	public get id() {
		return this._id;
	}

	constructor(id: string, controller: Controller) {
		this._controller = controller;
		this._id = id;
	}

	public onCellClick(position: IVec2): void {
		this._controller.onCellClick(position, this.id);
	}
}