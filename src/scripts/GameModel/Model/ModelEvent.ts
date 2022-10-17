import DoubleArray from '../../Utils/DoubleArray';
import { IVec2 } from '../../Utils/IVec2';
import { PlayerId } from './Model';

export enum ModelEvent {
	Init = "init",
	UpdateCell = "update-cell",
	IncreaseField = "increase-field",
	Win = "win",
}

export type MessageData = {
	[ModelEvent.Init]: { size: number, array: DoubleArray<PlayerId> },
	[ModelEvent.UpdateCell]: { position: IVec2, value: PlayerId },
	[ModelEvent.IncreaseField]: undefined,
	[ModelEvent.Win]: { winPlayerId: string, winLine: IVec2[] },
}