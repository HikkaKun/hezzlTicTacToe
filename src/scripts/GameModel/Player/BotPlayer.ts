import Controller from '../Controller/Controller';
import { PlayerId } from '../Model/Model';
import Player from './Player';

export default class BotPlayer extends Player {
	constructor(id: PlayerId, controller: Controller) {
		super(id, controller);
	}
}