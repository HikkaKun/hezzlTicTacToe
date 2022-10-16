import 'phaser';
import { IVec2 } from '../../Utils/IVec2';
import IView from '../../GameModel/View/IView';
import View from '../../GameModel/View/IView';
import { SceneKeys } from './SceneKeys';

export default class TicTacToeField extends Phaser.Scene implements IView {
	public abortController: AbortController;

	constructor() {
		super(SceneKeys.TicTacToeField);

		this.abortController = new AbortController();
	}

	public init() { }

	public create() { }

	public unsubscribe(): void {
		throw new Error('Method not implemented.');
	}

	public onInit(size: number): void {
		throw new Error('Method not implemented.');
	}

	public onUpdateCell(position: IVec2, value: unknown): void {
		throw new Error('Method not implemented.');
	}

	public onIncreaseField(): void {
		throw new Error('Method not implemented.');
	}

	public onWin(winPlayerId: string): void {
		throw new Error('Method not implemented.');
	}
}