import * as vscode from 'vscode';
import TreeDataProvider from '../../structure/treeDataProvider';
import { OrgDetails, OrgTypes } from '../../sfqtTypes';
import OrgDependency from '../dependency/orgsDependency';

export default class DevHubDataProvider extends TreeDataProvider {

	protected readonly ordType: OrgTypes = 'devHubs';

	constructor(sfCommandExecutor: any) {
		super();
		this.sfExecutor = sfCommandExecutor;
	}

	modifyOrgData(element: OrgDetails): OrgDetails {
		if (element.isDefaultDevHubUsername && element.defaultMarker) {
			element.iconName = 'mainDevHub';
		}
		element._id = `${element.alias}-${element.username}`;
		element.tooltip = `Status: ${element.connectedStatus}`;

		return element;
	}

	async getChildren(element?: OrgDependency): Promise<OrgDependency[]> {

		if (element) {
			return Promise.resolve([]);
		}

		const devOrgs = await this.fetchOrgList();

		const treeDeps: OrgDependency[] = await this.populateOrgTree(devOrgs, vscode.TreeItemCollapsibleState.None);

		return Promise.resolve(treeDeps);
	}
}
