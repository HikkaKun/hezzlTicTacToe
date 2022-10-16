import { IVec2 } from '../../Utils/IVec2';

export default interface IView {
	abortController: AbortController;

	unsubscribe(): void;

	onInit(size: number): void;
	onUpdateCell(position: IVec2, value: unknown): void;
	onIncreaseField(): void;
	onWin(winPlayerId: string): void;
}