import 'phaser';
import { ImageKeys } from '../Keys/ImageKeys';
import { SceneKeys } from './SceneKeys';

interface Asset {
	type: 'json' | 'image' | 'svg' | 'html';
	key: ImageKeys;
	url: string;
	settings: any;
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
		super({
			key: SceneKeys.Preloader,
			pack: {
				"files": [
					{ type: "json", key: 'assets', url: "assets/assets.json" },
					{ type: "json", key: 'customAssets', url: "assets/customAssets.json" }
				]
			}
		});
	}

	public async loadFont(name: string, url: string): Promise<void> {
		const newFont = new FontFace(name, `url(${url})`);
		const font = await newFont.load();

		document.fonts.add(font);
	}

	public preload(): void {
		const assets: Asset[] = this.cache.json.get('assets');
		const customAssets: CustomAsset[] = this.cache.json.get('customAssets');

		assets.forEach((asset: Asset) => this.load[asset.type](asset.key, 'assets/' + asset.url, asset?.settings));
		this.load.image('a', 'a',)

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

	public create(): void {
		this._loaderCompleted = true;
		this.checkIfComplete();
	}

	public checkIfComplete(): void {
		if (this._customCompleted && this._loaderCompleted)
			this.scene.start(SceneKeys.Menu);
	}
}