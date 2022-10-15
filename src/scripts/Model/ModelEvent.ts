export enum ModelEvent {
	Init = "init",
	UpdateCell = "update-cell",
	IncreaseField = "increase-field",
	Win = "win",
	Lose = "lose"
}

//TODO: заменить unknown на типы передаваемых данных при эмите евента
export type MessageData = {
	[ModelEvent.Init]: unknown,
	[ModelEvent.UpdateCell]: unknown,
	[ModelEvent.IncreaseField]: unknown,
	[ModelEvent.Win]: unknown,
	[ModelEvent.Lose]: unknown
}