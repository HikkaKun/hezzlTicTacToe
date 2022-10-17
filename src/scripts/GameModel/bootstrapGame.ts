import Controller from './Controller/Controller';
import Model, { ModelConfig } from './Model/Model';
import Player from './Player/Player';
import PlayerCreator from './PlayerCreator/PlayerCreator';
import IView from './View/IView';

export interface GameData {
	model: Model,
	controller: Controller,
	players: [Player, Player]
}

export function bootstrapGame(view: IView, playerCreator: PlayerCreator, config?: ModelConfig): GameData {
	const model = new Model(config);
	const controller = new Controller(model);
	const players = playerCreator.createPlayers(controller);

	controller.setPlayerIds([players[0].id, players[1].id]);
	model.subscribeView(view);

	return { model, controller, players };
}