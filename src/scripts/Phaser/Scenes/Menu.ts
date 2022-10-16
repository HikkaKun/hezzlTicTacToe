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
		const field = this.scene.add(SceneKeys.TicTacToeField, TicTacToeField, true) as TicTacToeField;
		this.field = field;

		const button = this.add.existing(new Button(this, 320, 320));
		button.init(ImageKeys.Button, () => {
			button.toggleInteractive(false);
			this.gameData = bootstrapGame(this.field, new LocalPlayerVsPlayerCreator());
		}, '2 Players');

	}
}