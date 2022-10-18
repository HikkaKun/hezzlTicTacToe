import 'phaser'
import Menu from './Phaser/Scenes/Menu';
import Preloader from './Phaser/Scenes/Preloader';

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 640,
	height: 640,
	parent: 'phaser-dom',
	scale: {
		// mode: Phaser.Scale.FIT,
		// autoCenter: Phaser.Scale.CENTER_BOTH
	},
	dom: {
		createContainer: true
	},
	pixelArt: true,
	scene: [Preloader, Menu]
}

const game = new Phaser.Game(config);