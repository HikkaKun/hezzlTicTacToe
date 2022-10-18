export function addGameButton(scene: Phaser.Scene, x: number, y: number, image: string | Phaser.Textures.Texture, callback: () => void, text?: string): Button {
	const button = new Button(scene, x, y);
	button.init(image, callback, text);

	scene.add.existing(button);

	return button;
}

export function toggleButtons(buttons: Button[], isOn: boolean, completeCallback?: Function, offset = 100): void {
	for (const button of buttons) {
		if (button.visible == isOn) continue;

		button.toggleInteractive(isOn);
		button.setVisible(isOn);
		button.alpha = isOn ? 1 : 0;
		button.y += (isOn ? offset : -offset);
	}
}

export function toggleButtonsFancy(scene: Phaser.Scene, buttons: Button[], isOn: boolean, completeCallback?: Function, offset = 100): void {
	for (const button of buttons) {
		button.toggleInteractive(isOn);
		button.setVisible(true);
	}

	scene.tweens.add({
		targets: buttons,
		delay: 250,
		y: '+=' + (isOn ? offset : -offset),
		alpha: isOn ? 1 : 0,
		duration: 250,
		ease: isOn ? Phaser.Math.Easing.Back.Out : Phaser.Math.Easing.Back.In,
		onComplete: () => completeCallback && completeCallback()
	});
}

export default class Button extends Phaser.GameObjects.Container {
	public image?: Phaser.GameObjects.Image;
	public text?: Phaser.GameObjects.Text;
	public callback?: () => void;

	protected _tween?: Phaser.Tweens.Tween;

	constructor(scene: Phaser.Scene, x: number, y: number) {
		super(scene, x, y);
	}

	protected _stopTween(): void {
		this._tween && this._tween.stop();
	}

	public get isInteractive() {
		return this.image?.input.enabled ? true : false;
	}

	public init(imageKey: string | Phaser.Textures.Texture, callback: () => void, textString?: string): void {
		const image = this.scene.add.image(0, 0, imageKey);

		this.add(image);
		this.image = image;
		this.callback = callback;

		this.toggleInteractive(true);

		if (!textString) return;

		const text = this.scene.add.text(0, 0, textString, { fontFamily: 'monogram', fontSize: "32px", });
		this.add(text);
		this.text = text;

		text.setOrigin(0.5);
		text.setColor("0x000000");
	}

	public toggleInteractive(isOn: boolean): void {
		if (!this.image) return;

		const image = this.image;
		if (isOn) {
			image.clearTint();
			image.setInteractive()
				.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OVER, () => image.setTint(0xDDDDDD))
				.on(Phaser.Input.Events.GAMEOBJECT_POINTER_OUT, () => image.clearTint())
				.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => this.click());
		} else {
			image.removeInteractive();
			image.setTint(0xAAAAAA);
		}
	}

	public click(): void {
		this._stopTween();

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