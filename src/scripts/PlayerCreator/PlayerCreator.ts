import Controller from '../Controller/Controller';
import Player from '../Player/Player';

export default abstract class PlayerCreator {
	protected getRandomId(): string {
		const randomNumber = Number(Math.random()).toFixed(8);

		return randomNumber
			.toString()		// convert number to string
			.substring(2)   // remove '0.' from string
			.split('')     // convert string to array of characters
			.map(Number)   // parse characters as numbers
			.map(n => (n || 10) + 64)   // convert to char code, correcting for J
			.map(c => Math.random() < 0.5 ? String.fromCharCode(c) : c)   // convert 50% of char codes to strings
			.join('');
	}

	public abstract createPlayers(controller: Controller): [Player, Player];
}