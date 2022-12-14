import { PlayerId } from '../Model/Model';
import { MessageData, ModelEvent } from '../Model/ModelEvent';

export default interface IView {
	abortController: AbortController;

	cellPressCallback?: (x: number, y: number) => void;

	unsubscribe(): void;

	onInit(data: MessageData[ModelEvent.Init]): void;
	onUpdateCell(data: MessageData[ModelEvent.UpdateCell]): void;
	onIncreaseField(data?: MessageData[ModelEvent.IncreaseField]): void;
	onWin(data: MessageData[ModelEvent.Win]): void;
	onIdentify(data: PlayerId): void;
}