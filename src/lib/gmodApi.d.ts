export interface GmodServerInfo {
	data: Datum[];
	links: Links;
	included: any[];
}

export interface Datum {
	type: string;
	id: string;
	attributes: Attributes;
	relationships: Links;
}

export interface Attributes {
	name: string;
	players: number;
	maxPlayers: number;
}

export interface Links {}
