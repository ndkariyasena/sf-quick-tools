import * as vscode from 'vscode';
import * as path from 'path';
import { OrgDetails } from '../../sfqtTypes';

export default class OrgDependency extends vscode.TreeItem {
	contextValue: string = '';
	iconName: string = 'disconnected';
	tooltip: string = '';
	description: string = '';
	orgDetails: OrgDetails = {} as OrgDetails;

	iconPath = {
		dark: vscode.Uri.file(path.join(__filename, '..', '..', 'resources', 'dark', `${this.iconName}.svg`)),
		light: vscode.Uri.file(path.join(__filename, '..', '..', 'resources', 'light', `${this.iconName}.svg`))
	};

	constructor(
		public readonly label: string,
		private orgType: string,
		orgDetails: OrgDetails,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState
	) {
		super(label, collapsibleState);

		this.contextValue = orgType;
		
		this.updateOrgDetails(orgDetails);
		this.updateIconPath();
	}

	updateOrgDetails(orgDetails: OrgDetails): void {
		this.orgDetails = orgDetails;

		const { iconName, username, _id, orgId, tooltip } = this.orgDetails;

		this.tooltip = tooltip || `${this.label}-${this.orgType}`;
		this.id = (_id ?? orgId) as string;
		this.description = username;
		if (iconName) {
			this.iconName = iconName as string;
		}
	}

	updateIconPath() {
		this.iconPath = {
			dark: vscode.Uri.file(path.join(__filename, '..', '..', 'resources', 'dark', `${this.iconName}.svg`)),
			light: vscode.Uri.file(path.join(__filename, '..', '..', 'resources', 'light', `${this.iconName}.svg`))
		};
	}
}