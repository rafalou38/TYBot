export const config = {
	prefix: "-",
	userJoinChannelID: "888032043454324767",
	suggestionsChannelID: "888025058252029992",
	anivChannelID: "889552659302977558",
	sondageChannelID: "888028368396775494",
	ticketCategoryID: "887010006703169596",
	xpIncrement: 2,
	xpAddDelaySeconds: 10,
	xpRequiredIncrease: 5,
};

/**@type {import("../types/context").context} */
export const context = {
	tickets: new Map(),
};
