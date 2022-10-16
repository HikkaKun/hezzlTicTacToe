import Controller from '../Controller/Controller';
import Player from './Player';

export default class BotPlayer extends Player {
	constructor(id: string, controller: Controller) {
		super(id, controller);
	}
}