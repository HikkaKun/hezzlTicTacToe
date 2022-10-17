import 'phaser';
import { bootstrapGame, GameData } from '../../GameModel/bootstrapGame';
import BotPlayer from '../../GameModel/Player/BotPlayer';
import Player from '../../GameModel/Player/Player';
import LocalPlayerVsPlayerCreator from '../../GameModel/PlayerCreator/LocalPlayerVsPlayerCreator';
import PlayerVsBotCreator from '../../GameModel/PlayerCreator/PlayerVsBotCreator';
import Button from '../GameObjects/Button';
import { ImageKeys } from '../Keys/ImageKeys';
import { SceneKeys } from './SceneKeys';
import TicTacToeField from './TicTacToeField';

export default class Menu extends Phaser.Scene {
	public field!: TicTacToeField;
	public gameData?: GameData;
	public elements: Phaser.GameObjects.GameObject[] = [];

	constructor() {
		super(SceneKeys.Menu);
	}

	public init(): void {
		this.cameras.main.setBackgroundColor('#555555');
	}

	public create(): void {
		this.field = this.scene.add(SceneKeys.TicTacToeField, TicTacToeField, true, { xOffset: 320, yOffset: 320, maxFieldSize: 320 }) as TicTacToeField;

		const localPvPButton = this.add.existing(new Button(this, 320, 320));

		localPvPButton.init(ImageKeys.Button, () => {
			localPvPButton.toggleInteractive(false);
			this.gameData = bootstrapGame(this.field, new LocalPlayerVsPlayerCreator());
			const { controller, players } = this.gameData;

			this.field.cellPressCallback = (x: number, y: number) => players[controller.getPlayerIndex()].clickOnCell({ x, y });

			this.off(() => controller.startGame());
		}, '2 Players');

		const botVsPlayerButton = this.add.existing(new Button(this, 320, 240));

		botVsPlayerButton.init(ImageKeys.Button, () => {
			botVsPlayerButton.toggleInteractive(false);
			this.gameData = bootstrapGame(this.field, new PlayerVsBotCreator());

			const { controller, players } = this.gameData;

			const human = players.find(player => !(player instanceof BotPlayer)) as Player;
			const bot = players.find(player => player instanceof BotPlayer) as BotPlayer;

			if (controller.checkCurrentPlayer(bot.id)) {
				bot.clickOnCell();
			}

			this.field.cellPressCallback = (x: number, y: number) => {

				if (controller.checkCurrentPlayer(human.id)) {
					human.clickOnCell({ x, y });

					if (controller.checkCurrentPlayer(bot.id)) {
						bot.clickOnCell();
					}
				}
			}
			this.off(() => {
				controller.startGame();
			});
		}, 'Singleplayer');

		this.elements.push(localPvPButton, botVsPlayerButton);
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