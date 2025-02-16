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

		return element;
	}

	getTreeItem(element: vscode.TreeItem): vscode.TreeItem {
		return element;
	}

	async getChildren(element?: vscode.TreeItem): Promise<OrgDependency[]> {

		if (element) {
			return Promise.resolve([]);
		}

		const devOrgs = await this.fetchOrgList();

		const treeDeps: OrgDependency[] = await this.populateOrgTree(devOrgs, vscode.TreeItemCollapsibleState.None);

		return Promise.resolve(treeDeps);
	}
}
