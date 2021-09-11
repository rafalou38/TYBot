import type { PermissionString } from "discord.js";

interface customRole {
	name: any;
	color: string;
	reason: string;
	permissions: Record<PermissionString, boolean>;
}
