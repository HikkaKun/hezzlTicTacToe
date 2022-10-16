import 'phaser';
import Button from '../GameObjects/Button';
import { ImageKeys } from '../Keys/ImageKeys';
import { SceneKeys } from './SceneKeys';

export default class Menu extends Phaser.Scene {
	constructor() {
		super(SceneKeys.Menu);
	}

	public init(): void {
		this.cameras.main.setBackgroundColor('#555555');
	}

	public create(): void {
		const button = this.add.existing(new Button(this, 320, 320));
		button.init(ImageKeys.Button, () => console.log('Click!'), 'Text');
	}
}