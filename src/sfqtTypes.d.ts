export type OrgTypes =
| 'scratchOrgs'
| 'devHubs'
| 'nonScratchOrgs'
| 'sandboxes'
| 'other';

type OrgDetails = {
	alias: string;
	username: string;
	orgId: string;
	instanceUrl: string;
	iconName?: string;
	tooltip?: string;
	activeScratchOrg?: boolean;
} & {
	[key: string]: string | number | boolean;
}

type OrgsList = {
	[key in OrgTypes]: OrgDetails[];
};
