import { IVec2 } from '../../Utils/IVec2';

export enum ModelEvent {
	Init = "init",
	UpdateCell = "update-cell",
	IncreaseField = "increase-field",
	Win = "win",
}

export type MessageData = {
	[ModelEvent.Init]: { size: number },
	[ModelEvent.UpdateCell]: { position: IVec2, value: unknown },
	[ModelEvent.IncreaseField]: undefined,
	[ModelEvent.Win]: { winPlayerId: string },
}