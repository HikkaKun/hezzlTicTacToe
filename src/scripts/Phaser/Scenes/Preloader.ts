import 'phaser';
import { ImageKeys } from '../Keys/ImageKeys';
import { SceneKeys } from './SceneKeys';

export default class Preloader extends Phaser.Scene {
	constructor() {
		super(SceneKeys.Preloader);
	}

	public loadFont(name: string, url: string): void {
		const newFont = new FontFace(name, `url(${url})`);
		newFont.load().then(function (loaded) {
			document.fonts.add(loaded);
		}).catch(function (error) {
			return error;
		});
	}

	public preload(): void {
		this.loadFont('monogram', 'assets/monogram-extended.ttf');
		this.load.image(ImageKeys.Button, 'assets/images/grey_button00.png');
	}

	public create(): void {
		this.scene.start(SceneKeys.Menu);
	}
}