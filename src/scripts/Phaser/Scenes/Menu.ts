import 'phaser';
import BotVsPlayerGameCreator from '../../GameModel/GameCreator/BotVsPlayerGameCreator';
import OnlineVsPlayerGameCreator from '../../GameModel/GameCreator/OnlineVsPlayerGameCreator';
import PlayerVsPlayerGameCreator from '../../GameModel/GameCreator/PlayerVsPlayerGameCreator';
import { PlayerId } from '../../GameModel/Model/Model';
import Player from '../../GameModel/Player/Player';
import OnlineAdapter from '../../Online/OnlineAdapter';
import OnlineViewAdapter from '../../Online/OnlineViewAdapter';
import { ALPHABET } from '../../Utils/Utils';
import Button, { addGameButton, toggleButtons, toggleButtonsFancy } from '../GameObjects/Button';
import { ImageKeys } from '../Keys/ImageKeys';
import { SceneKeys } from './SceneKeys';
import TicTacToeField from './TicTacToeField';

export default class Menu extends Phaser.Scene {
	public field!: TicTacToeField;
	public players?: [Player, Player];
	public elements: Button[] = [];
	public chooseModeElements: Button[] = [];
	public multiplayerElements: Button[] = [];
	public connectButton!: Button;

	public inputForm!: Phaser.GameObjects.DOMElement;
	public textbox!: HTMLInputElement;

	constructor() {
		super(SceneKeys.Menu);
	}

	public init(): void {
		this.cameras.main.setBackgroundColor('#555555');
	}

	public create(): void {
		this.field = this.scene.add(SceneKeys.TicTacToeField, TicTacToeField, true, { xOffset: 320, yOffset: 320, maxFieldSize: 320 }) as TicTacToeField;
		this.field.offCallback = () => {
			toggleButtonsFancy(this, this.elements, true);
		}


		this.createMainMenu();
		this.createBotModeMenu();
		this.createMultiplayerMenu();

		toggleButtons(this.chooseModeElements, false);
		toggleButtons(this.multiplayerElements, false);
	}

	public createMainMenu(): void {
		const playerVsPlayer = addGameButton(this, 320, 320, ImageKeys.Button, () => {
			const gameCreator = new PlayerVsPlayerGameCreator();

			this.field.restartCallback = () => gameCreator.restart();

			toggleButtonsFancy(this, this.elements, false, () => this.players = gameCreator.createGame(this.field));
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

			toggleButtonsFancy(this, this.chooseModeElements, false, () => this.players = gameCreator.createGame(this.field));
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
				toggleButtonsFancy(this, this.multiplayerElements, false, () => gameCreator.createGame(this.field));
			} else {
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