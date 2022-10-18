import 'phaser';
import BotVsPlayerGameCreator from '../../GameModel/GameCreator/BotVsPlayerGameCreator';
import PlayerVsPlayerGameCreator from '../../GameModel/GameCreator/PlayerVsPlayerGameCreator';
import Player from '../../GameModel/Player/Player';
import Button from '../GameObjects/Button';
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

		const playerVsPlayer = this.addGameButton(320, 320, ImageKeys.Button, () => {
			playerVsPlayer.toggleInteractive(false);

			this.off(() => this.players = new PlayerVsPlayerGameCreator().createGame(this.field));
		}, '2 Players');

		const botVsPlayer = this.addGameButton(320, 240, ImageKeys.Button, () => {
			botVsPlayer.toggleInteractive(false);

			this.off(() => this.players = new BotVsPlayerGameCreator().createGame(this.field));
		}, 'Singleplayer');
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

	public addGameButton(x: number, y: number, image: string | Phaser.Textures.Texture, callback: () => void, text?: string): Button {
		const button = new Button(this, x, y);

		button.init(image, callback, text);

		this.add.existing(button);
		this.elements.push(button);

		return button;
	}
}