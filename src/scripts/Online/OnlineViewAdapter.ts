import { PlayerId } from '../GameModel/Model/Model';
import { ModelEvent } from '../GameModel/Model/ModelEvent';
import IView from '../GameModel/View/IView';
import DoubleArray from '../Utils/DoubleArray';
import { IVec2 } from '../Utils/IVec2';
import OnlineAdapter from './OnlineAdapter';

export default class OnlineViewAdapter implements IView {
	public abortController: AbortController;
	public cellPressCallback?: (x: number, y: number) => void;

	constructor() {
		this.abortController = new AbortController();
	}

	unsubscribe(): void {
		this.abortController.abort();

		this.abortController = new AbortController();
	}

	onInit(data: { size: number; array: DoubleArray<PlayerId>; }): void {
		OnlineAdapter.sendMessageToPeer(ModelEvent.Init, data);
	}

	onUpdateCell(data: { position: IVec2; value: PlayerId; }): void {
		OnlineAdapter.sendMessageToPeer(ModelEvent.UpdateCell, data);
	}

	onIncreaseField(data?: undefined): void {
		OnlineAdapter.sendMessageToPeer(ModelEvent.IncreaseField, data);
	}

	onWin(data: { winPlayerId: string; winLine: IVec2[]; }): void {
		OnlineAdapter.sendMessageToPeer(ModelEvent.Win, data);
	}

	onIdentify(data: PlayerId): void {
		OnlineAdapter.sendIdentifyMessage(data);
	}
}