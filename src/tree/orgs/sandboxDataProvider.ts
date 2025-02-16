import * as vscode from 'vscode';
import TreeDataProvider from '../../structure/treeDataProvider';
import { OrgDetails, OrgTypes } from '../../sfqtTypes';
import OrgDependency from '../dependency/orgsDependency';

export default class SandboxDataProvider extends TreeDataProvider {

	protected readonly ordType: OrgTypes = 'sandboxes';

	constructor(sfCommandExecutor: any) {
		super();
		this.sfExecutor = sfCommandExecutor;
	}

	modifyOrgData(element: OrgDetails): OrgDetails {
		element._id = `${element.alias}-${element.username}`;
		element.tooltip = `Status: ${element.connectedStatus}`;
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
