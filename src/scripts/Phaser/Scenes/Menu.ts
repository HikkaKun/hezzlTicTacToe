import 'phaser';
import BotVsPlayerGameCreator from '../../GameModel/GameCreator/BotVsPlayerGameCreator';
import PlayerVsPlayerGameCreator from '../../GameModel/GameCreator/PlayerVsPlayerGameCreator';
import { PlayerId } from '../../GameModel/Model/Model';
import Player from '../../GameModel/Player/Player';
import Button, { addGameButton, toggleButtons, toggleButtonsFancy } from '../GameObjects/Button';
import { ImageKeys } from '../Keys/ImageKeys';
import { SceneKeys } from './SceneKeys';
import TicTacToeField from './TicTacToeField';

export default class Menu extends Phaser.Scene {
	public field!: TicTacToeField;
	public players?: [Player, Player];
	public elements: Phaser.GameObjects.GameObject[] = [];

	public chooseModeElements: Phaser.GameObjects.GameObject[] = [];

	constructor() {
		super(SceneKeys.Menu);
	}

	public init(): void {
		this.cameras.main.setBackgroundColor('#555555');
	}

	public create(): void {
		this.field = this.scene.add(SceneKeys.TicTacToeField, TicTacToeField, true, { xOffset: 320, yOffset: 320, maxFieldSize: 320 }) as TicTacToeField;
		this.field.offCallback = () => {
			toggleButtonsFancy(this, this.elements as Button[], true);
		}

		const playerVsPlayer = addGameButton(this, 320, 320, ImageKeys.Button, () => {
			playerVsPlayer.toggleInteractive(false);

			const gameCreator = new PlayerVsPlayerGameCreator();

			this.field.restartCallback = () => gameCreator.restart();

			toggleButtonsFancy(this, this.elements as Button[], false, () => this.players = gameCreator.createGame(this.field));
		}, '2 Players');

		const botVsPlayer = addGameButton(this, 320, 240, ImageKeys.Button, () => this.toggleModeMenu(true), 'Singleplayer');

		this.createBotModeMenu();
		toggleButtons(this.chooseModeElements as Button[], false);

		this.elements.push(playerVsPlayer, botVsPlayer);
	}

	public createBotModeMenu(): void {
		const random = this.createBotModeButton(320, 260, 'random');
		const first = this.createBotModeButton(320, 320, 'first');
		const second = this.createBotModeButton(320, 380, 'second');
		const back = addGameButton(this, 320, 460, ImageKeys.Button, () => this.toggleModeMenu(false), 'Back');

		this.chooseModeElements.push(random, first, second, back);
	}

	public createBotModeButton(x: number, y: number, mode: 'first' | 'second' | 'random'): Button {
		let text = 'Random';

		switch (mode) {
			case 'first':
				text = 'X';
				break;
			case 'second':
				text = 'O';
				break;
		}

		const button = addGameButton(this, x, y, ImageKeys.Button, () => {
			button.toggleInteractive(false);

			const gameCreator = new BotVsPlayerGameCreator();

			if (mode != 'random') {
				gameCreator.setPlayerId(mode == 'first' ? PlayerId.Cross : PlayerId.Circle);
			}

			this.field.restartCallback = () => {
				if (mode == 'random') {
					gameCreator.setPlayerId('random');
				}

				gameCreator.restart()
			};

			toggleButtonsFancy(this, this.chooseModeElements as Button[], false, () => this.players = gameCreator.createGame(this.field));
		}, text);

		return button;
	}

	public toggleModeMenu(isOn: boolean): void {
		if (isOn) {
			toggleButtonsFancy(this, this.elements as Button[], !isOn,
				() => toggleButtonsFancy(this, this.chooseModeElements as Button[], isOn));
		} else {
			toggleButtonsFancy(this, this.chooseModeElements as Button[], isOn,
				() => toggleButtonsFancy(this, this.elements as Button[], !isOn));
		}
	}
}