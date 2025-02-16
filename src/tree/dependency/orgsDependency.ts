import * as vscode from 'vscode';
import * as path from 'path';
import { OrgDetails } from '../../sfqtTypes';

export default class OrgDependency extends vscode.TreeItem {
	iconName: string = 'disconnected';
	tooltip: string;
	description: string;

	iconPath = {
		dark: vscode.Uri.file(path.join(__filename, '..', '..', 'resources', 'light', `${this.iconName}.svg`)),
		light: vscode.Uri.file(path.join(__filename, '..', '..', 'resources', 'dark', `${this.iconName}.svg`))
	};

	constructor(
		public readonly label: string,
		private orgType: string,
		private orgDetails: OrgDetails,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState
	) {
		super(label, collapsibleState);

		this.tooltip = `${this.label}-${this.orgType}`;
		this.orgDetails = orgDetails;

		const { iconName, username, _id, orgId } = this.orgDetails;

		this.id = (_id ?? orgId) as string;
		this.description = username;
		if (iconName) {
			this.iconName = iconName as string;
		}
		
		this.updateIconPath();
	}

	updateIconPath() {
		this.iconPath = {
			dark: vscode.Uri.file(path.join(__filename, '..', '..', 'resources', 'light', `${this.iconName}.svg`)),
			light: vscode.Uri.file(path.join(__filename, '..', '..', 'resources', 'dark', `${this.iconName}.svg`))
		};
	}
}