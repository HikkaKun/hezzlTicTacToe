import { PlayerId } from '../GameModel/Model/Model';
import IView from '../GameModel/View/IView';
import DoubleArray from '../Utils/DoubleArray';
import { IVec2 } from '../Utils/IVec2';

export default class OnlineViewAdapter implements IView {
	abortController: AbortController;
	cellPressCallback?: (x: number, y: number) => void;

	constructor() {
		this.abortController = new AbortController();
	}

	unsubscribe(): void {
		throw new Error('Method not implemented.');
	}
	onInit(data: { size: number; array: DoubleArray<PlayerId>; }): void {
		throw new Error('Method not implemented.');
	}
	onUpdateCell(data: { position: IVec2; value: PlayerId; }): void {
		throw new Error('Method not implemented.');
	}
	onIncreaseField(data?: undefined): void {
		throw new Error('Method not implemented.');
	}
	onWin(data: { winPlayerId: string; winLine: IVec2[]; }): void {
		throw new Error('Method not implemented.');
	}

}