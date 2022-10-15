import Model from '../Model/Model';

export default class Controller {
	private _model: Model;

	constructor(model: Model) {
		this._model = model;
	}
}