export default class Button extends Phaser.GameObjects.Container {
	public image!: Phaser.GameObjects.Image;
	public text!: Phaser.GameObjects.Text;
	public callback!: () => void;

	protected _tween?: Phaser.Tweens.Tween;

	constructor(scene: Phaser.Scene, x: number, y: number) {
		super(scene, x, y);
	}

	public init(imageKey: string | Phaser.Textures.Texture, callback: () => void, textString?: string): void {
		const image = this.scene.add.image(0, 0, imageKey);

		this.add(image);
		this.image = image;
		this.callback = callback;

		this.image.setInteractive()
			.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => this.image.setTint(0xDDDDDD))
			.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => this.image.clearTint())
			.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => this.click());

		if (!textString) return;

		const text = this.scene.add.text(0, 0, textString, { fontFamily: 'monogram' });
		this.add(text);
		this.text = text;

		text.setOrigin(0.5);
		text.setColor("0x000000");
	}

	public click() {
		this._tween && this._tween.stop();

		this.scale = 0.9;
		this._tween = this.scene.tweens.add({
			targets: this,
			scale: 1,
			duration: 500,
			ease: Phaser.Math.Easing.Back.Out,
		});

		this.callback && this.callback();
	}
}