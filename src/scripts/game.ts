import 'phaser';
import GameServer from './Model/GameServer';
import { PlayerID } from './Model/PlayerID';

const s = new GameServer(PlayerID.Random);

const game = new Phaser.Game();