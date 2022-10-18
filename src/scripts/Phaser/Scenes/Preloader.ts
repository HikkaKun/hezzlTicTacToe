import 'phaser';
import { ImageKeys } from '../Keys/ImageKeys';
import { SceneKeys } from './SceneKeys';

interface Asset {
	type: 'json' | 'image' | 'svg';
	key: ImageKeys;
	url: string
}

interface CustomAsset {
	type: 'font';
	key: ImageKeys;
	url: string
}

export default class Preloader extends Phaser.Scene {
	protected _customCompleted = false;
	protected _loaderCompleted = false;

	constructor() {
		super(SceneKeys.Preloader);
	}

	public async loadFont(name: string, url: string): Promise<void> {
		const newFont = new FontFace(name, `url(${url})`);
		const font = await newFont.load();

		document.fonts.add(font);
	}

	public preload(): void {
		this.load.json('assets', 'assets/assets.json');
		this.load.json('customAssets', 'assets/customAssets.json');
	}

	public create(): void {
		const assets: Asset[] = this.cache.json.get('assets');
		const customAssets: CustomAsset[] = this.cache.json.get('customAssets');

		assets.forEach((asset: Asset) => this.load[asset.type](asset.key, 'assets/' + asset.url));

		this.load.start();
		this.load.addListener(Phaser.Loader.Events.COMPLETE, () => {
			this._loaderCompleted = true;
			this.checkIfComplete();
		});

		Promise.all(customAssets.map((asset: CustomAsset) => {
			switch (asset.type) {
				case 'font':
					return this.loadFont(asset.key, 'assets/' + asset.url);
			}
		})).then(() => {
			this._customCompleted = true
			this.checkIfComplete();
		});
	}

	public checkIfComplete() {
		if (this._customCompleted && this._loaderCompleted)
			this.scene.start(SceneKeys.Menu);
	}
}