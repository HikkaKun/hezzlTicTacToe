import 'phaser';
import BotVsPlayerGameCreator from '../../GameModel/GameCreator/BotVsPlayerGameCreator';
import OnlineVsPlayerGameCreator from '../../GameModel/GameCreator/OnlineVsPlayerGameCreator';
import PlayerVsPlayerGameCreator from '../../GameModel/GameCreator/PlayerVsPlayerGameCreator';
import { ModelConfig, PlayerId } from '../../GameModel/Model/Model';
import OnlineAdapter from '../../GameModel/Online/OnlineAdapter';
import { ALPHABET } from '../../Utils/Utils';
import Button, { addGameButton, toggleButtons, toggleButtonsFancy } from '../GameObjects/Button';
import { ImageKeys } from '../Keys/ImageKeys';
import { SceneKeys } from './SceneKeys';
import TicTacToeField from './TicTacToeField';
import { JsonKeys } from '../Keys/JsonKeys';

export default class Menu extends Phaser.Scene {
	public field!: TicTacToeField;
	public elements: Button[] = [];
	public chooseModeElements: Button[] = [];
	public multiplayerElements: Button[] = [];
	public connectButton!: Button;
	public config!: ModelConfig;

	public inputForm!: Phaser.GameObjects.DOMElement;
	public textbox!: HTMLInputElement;

	constructor() {
		super(SceneKeys.Menu);
	}

	public init(): void {
		this.cameras.main.setBackgroundColor('#555555');
	}

	public create(): void {
		this.config = this.cache.json.get(JsonKeys.ModelConfig);

		this.field = this.scene.add(SceneKeys.TicTacToeField, TicTacToeField, true, { xOffset: 320, yOffset: 320, maxFieldSize: 320 }) as TicTacToeField;
		this.field.offCallback = () => {
			toggleButtonsFancy(this, this.elements, true);
		}

		this.createBackground();
		this.createMainMenu();
		this.createBotModeMenu();
		this.createMultiplayerMenu();

		toggleButtons(this.chooseModeElements, false);
		toggleButtons(this.multiplayerElements, false);
	}

	public createBackground(): void {
		const graphics = new Phaser.GameObjects.Graphics(this);

		graphics.fillStyle(0xffffff, 1);
		graphics.fillRect(0, 0, 640, 640);

		graphics.generateTexture('menu-background');

		const background = this.add.image(0, 0, 'menu-background').setOrigin(0);

		function getTint(value: number) {
			const baseColor = Phaser.Display.Color.HexStringToColor('0087FF');
			const secondColor = Phaser.Display.Color.HexStringToColor('7000FF')

			const interpolated = Phaser.Display.Color.Interpolate.ColorWithColor(
				baseColor,
				secondColor,
				255,
				value * 100
			);

			return Phaser.Display.Color.ObjectToColor(interpolated).color;
		}

		const randomCounter = (callback: (tween: Phaser.Tweens.Tween) => void) => {
			return this.tweens.addCounter({
				from: 0,
				to: 1,
				duration: 1000 + Math.random() * 1000,
				yoyo: true,
				repeat: -1,
				onUpdate: callback
			});
		}

		randomCounter(function (tween) { background.tintTopLeft = getTint(tween.getValue()) });
		randomCounter(function (tween) { background.tintTopRight = getTint(tween.getValue()) });
		randomCounter(function (tween) { background.tintBottomLeft = getTint(tween.getValue()) });
		randomCounter(function (tween) { background.tintBottomRight = getTint(tween.getValue()) });
	}

	public createMainMenu(): void {
		const playerVsPlayer = addGameButton(this, 320, 320, ImageKeys.Button, () => {
			const gameCreator = new PlayerVsPlayerGameCreator();

			this.field.restartCallback = () => gameCreator.restart();
			this.field.currentPlayerText.setAlpha(1);
			toggleButtonsFancy(this, this.elements, false, () => gameCreator.createGame(this.field, this.config));
		}, '2 Players');

		const botVsPlayer = addGameButton(this, 320, 270, ImageKeys.Button, () => this.toggleModeMenu(true), 'Singleplayer');

		const hostButton = addGameButton(this, 320, 370, ImageKeys.Button, () => {
			OnlineAdapter.openCallback = (id) => this.textbox.value = id;
			OnlineAdapter.initPeer();

			this.toggleMultiplayerMenu(true, true);
		}, 'Host');

		const connectButton = addGameButton(this, 320, 420, ImageKeys.Button, () => {
			OnlineAdapter.openCallback = (id) => this.textbox.value = id;
			OnlineAdapter.initPeer();

			this.toggleMultiplayerMenu(true, false);
		}, 'Connect');

		this.elements.push(playerVsPlayer, botVsPlayer, hostButton, connectButton);
	}

	public createBotModeMenu(): void {
		const random = this.createBotModeButton(320, 270, 'random');
		const first = this.createBotModeButton(320, 320, 'first');
		const second = this.createBotModeButton(320, 370, 'second');
		const back = addGameButton(this, 320, 470, ImageKeys.Button, () => this.toggleModeMenu(false), 'Back');

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
			this.field.currentPlayerText.setAlpha(0);
			toggleButtonsFancy(this, this.chooseModeElements, false, () => gameCreator.createGame(this.field, this.config));
		}, text);

		return button;
	}

	public createMultiplayerMenu(): void {
		const element = this.add.dom(320, 320).createFromCache('textbox');

		const textbox = element.getChildByName('ID') as HTMLInputElement;

		element.addListener('input');
		element.on('input', () => {
			const text = textbox.value.toUpperCase();
			let corrected = "";

			for (const char of text) {
				if (ALPHABET.includes(char)) {
					corrected += char;
				}
			}

			textbox.value = corrected.substring(0, 4);
		});

		element.setVisible(false);

		const back = addGameButton(this, 320, 420, ImageKeys.Button, () => this.toggleMultiplayerMenu(false), 'Back');
		const connect = addGameButton(this, 320, 370, ImageKeys.Button, () => OnlineAdapter.connect(textbox.value), 'Connect');

		OnlineAdapter.connectCallback = () => {
			const isHost = !this.connectButton.isInteractive;

			if (isHost) {

				const gameCreator = new OnlineVsPlayerGameCreator();
				this.field.restartCallback = () => gameCreator.restart();

				this.inputForm.setVisible(false);
				this.field.currentPlayerText.setAlpha(1);
				toggleButtonsFancy(this, this.multiplayerElements, false, () => gameCreator.createGame(this.field, this.config));
			} else {
				OnlineAdapter.view = this.field;
				this.field.cellPressCallback = (x, y) => OnlineAdapter.sendClickEventToHost({ x, y });

				this.field.restartCallback = () => OnlineAdapter.sendRestartMessage();

				this.inputForm.setVisible(false);
				toggleButtonsFancy(this, this.multiplayerElements, false);
			}
		}

		this.inputForm = element;
		this.textbox = textbox;
		this.connectButton = connect;
		this.multiplayerElements.push(back, connect);
	}

	public toggleModeMenu(isOn: boolean): void {
		if (isOn) {
			toggleButtonsFancy(this, this.elements, !isOn,
				() => toggleButtonsFancy(this, this.chooseModeElements, isOn));
		} else {
			toggleButtonsFancy(this, this.chooseModeElements, isOn,
				() => toggleButtonsFancy(this, this.elements, !isOn));
		}
	}

	public toggleMultiplayerMenu(isOn: boolean, isHost: boolean = true): void {
		if (isOn) {
			toggleButtonsFancy(this, this.elements, !isOn,
				() => {
					toggleButtonsFancy(this, this.multiplayerElements, isOn, () => this.inputForm.setVisible(isOn))
					this.textbox.readOnly = isHost;
					this.textbox.value = isHost ? OnlineAdapter.id : this.textbox.value;
					isHost && this.connectButton.toggleInteractive(!isHost);
				});
		} else {
			this.inputForm.setVisible(isOn)

			toggleButtonsFancy(this, this.multiplayerElements, isOn,
				() => toggleButtonsFancy(this, this.elements, !isOn));
		}
	}
}