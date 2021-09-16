export const config = {
	prefix: "-",
	userJoinChannelID: "887010085484757025",
	suggestionsChannelID: "888025058252029992",
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
