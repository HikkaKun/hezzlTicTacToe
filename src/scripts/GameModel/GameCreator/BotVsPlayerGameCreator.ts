import Controller from '../Controller/Controller';
import Model, { ModelConfig, PlayerId } from '../Model/Model';
import BotPlayer from '../Player/BotPlayer';
import Player from '../Player/Player';
import IView from '../View/IView';
import GameCreator from './GameCreator';

export default class BotVsPlayerGameCreator extends GameCreator {
	public createGame(view: IView, config?: ModelConfig): [Player, Player] {
		const model = new Model(config);
		const controller = new Controller(model);

		const isPlayerFirst = Math.random() < 0.5;

		const players: [Player, Player] = isPlayerFirst
			? [new Player(PlayerId.Cross, controller), new BotPlayer(PlayerId.Circle, controller)]
			: [new BotPlayer(PlayerId.Cross, controller), new Player(PlayerId.Circle, controller)]

		model.subscribeView(view);

		controller.setPlayerIds([players[0].id, players[1].id]);

		view.cellPressCallback = (x: number, y: number) => {
			const human = players[isPlayerFirst ? 0 : 1];
			const bot = players[isPlayerFirst ? 1 : 0];

			if (controller.checkCurrentPlayer(human.id)) {
				controller.onCellClick({ x, y }, human.id);

				if (controller.checkCurrentPlayer(bot.id)) {
					bot.clickOnCell();
				}
			}
		};

		if (!isPlayerFirst) {
			players[0].clickOnCell();
		}

		controller.startGame();

		return players;
	}
}