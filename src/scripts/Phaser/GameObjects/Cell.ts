import 'phaser';
import { ImageKeys } from '../Keys/ImageKeys';

export default class Cell extends Phaser.GameObjects.Container {
	protected _size: number;

	public border: Phaser.GameObjects.Image;
	public cross: Phaser.GameObjects.Image;
	public circle: Phaser.GameObjects.Image;
	public callback?: (x: number, y: number) => void;

	public fieldX: number = 0;
	public fieldY: number = 0;

	public get size() {
		return this._size;
	}

	constructor(scene: Phaser.Scene, x: number, y: number) {
		super(scene, x, y);

		this.border = this._addImage(ImageKeys.CellBorder);
		this.cross = this._addImage(ImageKeys.Cross).setAlpha(0);
		this.circle = this._addImage(ImageKeys.Circle).setAlpha(0);

		this._size = this.border.width;

		this.border.setInteractive()
			.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => this.callback && this.callback(this.fieldX, this.fieldY));
	}

	protected _addImage(key: string): Phaser.GameObjects.Image {
		const image = this.scene.add.image(0, 0, key);
		image.setOrigin(0.5);
		this.add(image);

		return image;
	}

	public setCellSize(size: number): void {
		this.border.setDisplaySize(size, size);
		this.cross.setDisplaySize(size * 0.8, size * 0.8);
		this.circle.setDisplaySize(size * 0.8, size * 0.8);

		this._size = size;
	}

	public setCross(): void {
		this.circle.setAlpha(0);
		this.cross.setAlpha(1);

		this.cross.scale = 0;
		this.cross.angle = 180;

		this.scene.tweens.add({
			targets: this.cross,
			scale: this.border.scale * 0.8,
			angle: '+=180',
			duration: 1000,
			ease: Phaser.Math.Easing.Back.Out,
			onUpdate: (tween) => {
				tween.updateTo('scale', this.border.scale * 0.8);
			}
		})
	}

	public setCircle(): void {
		this.circle.setAlpha(1);
		this.cross.setAlpha(0);

		this.circle.scale = 0;

		this.scene.tweens.add({
			targets: this.circle,
			scale: 0.8,
			duration: 1000,
			ease: Phaser.Math.Easing.Back.Out,
			onUpdate: (tween) => {
				tween.updateTo('scale', this.border.scale * 0.8);
			}
		})
	}

	public setTint(value: number): void {
		for (const child of this.list) {
			if (child instanceof Phaser.GameObjects.Image)
				child.setTint(value);
		}
	}
}