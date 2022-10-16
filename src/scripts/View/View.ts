import { MessageData, ModelEvent } from '../Model/ModelEvent';
import { IVec2 } from '../Utils/IVec2';

export default abstract class View {
	protected _abortController: AbortController;

	constructor() {
		this._abortController = new AbortController();
	}

	public subscribe(target: EventTarget): void {
		const subscribeOnEvent = (event: ModelEvent): void =>
			target.addEventListener(event, (event) => this.onEvent(<CustomEvent>event), { signal: this._abortController.signal });

		subscribeOnEvent(ModelEvent.Init);
		subscribeOnEvent(ModelEvent.UpdateCell);
		subscribeOnEvent(ModelEvent.IncreaseField);
		subscribeOnEvent(ModelEvent.Win);
	}

	public unsubscribe() {
		this._abortController.abort();
	}

	public onEvent({ type, detail: data }: CustomEvent) {
		switch (type) {
			case ModelEvent.Init:
				this.onInit((<MessageData[ModelEvent.Init]>data).size);
				break;
			case ModelEvent.UpdateCell:
				const { position, value } = data as MessageData[ModelEvent.UpdateCell];
				this.onUpdateCell(position, value);
				break;
			case ModelEvent.IncreaseField:
				this.onIncreaseField();
				break;
			case ModelEvent.Win:
				this.onWin((<MessageData[ModelEvent.Win]>data).winPlayerId)
				break;
		}
	}

	public onInit(size: number): void { }

	public onUpdateCell(position: IVec2, value: unknown): void { }

	public onIncreaseField(): void { }

	public onWin(winPlayerId: string): void { }
}