import OnlineAdapter from '../../Online/OnlineAdapter';
import Controller from '../Controller/Controller';
import { PlayerId } from '../Model/Model';
import Player from './Player';

export default class OnlinePlayer extends Player {
	constructor(id: PlayerId, controller: Controller) {
		super(id, controller);

		OnlineAdapter.onPeerClick = (position) => this.clickOnCell(position);
	}
}