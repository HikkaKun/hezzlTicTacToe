import 'phaser';
import BotVsPlayerGameCreator from '../../GameModel/GameCreator/BotVsPlayerGameCreator';
import PlayerVsPlayerGameCreator from '../../GameModel/GameCreator/PlayerVsPlayerGameCreator';
import Player from '../../GameModel/Player/Player';
import Button, { addGameButton } from '../GameObjects/Button';
import { ImageKeys } from '../Keys/ImageKeys';
import { SceneKeys } from './SceneKeys';
import TicTacToeField from './TicTacToeField';

export default class Menu extends Phaser.Scene {
	public field!: TicTacToeField;
	public players?: [Player, Player];
	public elements: Phaser.GameObjects.GameObject[] = [];

	constructor() {
		super(SceneKeys.Menu);
	}

	public init(): void {
		this.cameras.main.setBackgroundColor('#555555');
	}

	public create(): void {
		this.field = this.scene.add(SceneKeys.TicTacToeField, TicTacToeField, true, { xOffset: 320, yOffset: 320, maxFieldSize: 320 }) as TicTacToeField;

		const playerVsPlayer = addGameButton(this, 320, 320, ImageKeys.Button, () => {
			playerVsPlayer.toggleInteractive(false);

			const gameCreator = new PlayerVsPlayerGameCreator();

			this.field.restartCallback = () => gameCreator.restart();

			this.off(() => this.players = gameCreator.createGame(this.field));
		}, '2 Players');

		const botVsPlayer = addGameButton(this, 320, 240, ImageKeys.Button, () => {
			botVsPlayer.toggleInteractive(false);

			const gameCreator = new BotVsPlayerGameCreator();

			this.field.restartCallback = () => gameCreator.restart();

			this.off(() => this.players = gameCreator.createGame(this.field));
		}, 'Singleplayer');

		this.elements.push(playerVsPlayer, botVsPlayer);
	}

	public off(completeCallback?: Function): void {
		this.tweens.add({
			targets: this.elements,
			delay: 250,
			alpha: 0,
			duration: 250,
			onComplete: () => completeCallback && completeCallback()
		});
	}
}