import 'phaser';
import { bootstrapGame, GameData } from '../../GameModel/bootstrapGame';
import LocalPlayerVsPlayerCreator from '../../GameModel/PlayerCreator/LocalPlayerVsPlayerCreator';
import Button from '../GameObjects/Button';
import { ImageKeys } from '../Keys/ImageKeys';
import { SceneKeys } from './SceneKeys';
import TicTacToeField from './TicTacToeField';

export default class Menu extends Phaser.Scene {
	public field!: TicTacToeField;
	public gameData?: GameData;

	constructor() {
		super(SceneKeys.Menu);
	}

	public init(): void {
		this.cameras.main.setBackgroundColor('#555555');
	}

	public create(): void {
		this.field = this.scene.add(SceneKeys.TicTacToeField, TicTacToeField, true, { xOffset: 320, yOffset: 320, maxFieldSize: 320 }) as TicTacToeField;

		const button = this.add.existing(new Button(this, 320, 320));
		button.init(ImageKeys.Button, () => {
			button.toggleInteractive(false);
			this.gameData = bootstrapGame(this.field, new LocalPlayerVsPlayerCreator(), { initialSize: 3 });
			const { controller, players } = this.gameData;

			this.field.cellPressCallback = (x: number, y: number) => players[controller.getPlayerIndex()].clickOnCell({ x, y });

			controller.startGame();
			this.tweens.add({
				targets: button,
				delay: 250,
				alpha: 0,
				duration: 500
			});
		}, '2 Players');

	}
}