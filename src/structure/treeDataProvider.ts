import * as vscode from 'vscode';
import SfCommander from './sfCommander';
import { OrgDetails, OrgTypes } from '../sfqtTypes';
import { OrgDependency } from '../tree';

export default abstract class TreeDataProvider
	implements vscode.TreeDataProvider<vscode.TreeItem>
{
	private _onDidChangeTreeData: vscode.EventEmitter<
		vscode.TreeItem | undefined
	> = new vscode.EventEmitter<vscode.TreeItem | undefined>();
	readonly onDidChangeTreeData: vscode.Event<vscode.TreeItem | undefined> =
		this._onDidChangeTreeData.event;

	private _treeData: vscode.TreeItem[] = [];
	protected readonly ordType: OrgTypes = 'scratchOrgs';
	protected sfExecutor!: SfCommander;

	refresh(): void {
		this._onDidChangeTreeData.fire(undefined);
	}

	abstract getTreeItem(element: vscode.TreeItem): vscode.TreeItem;
	abstract getChildren(element?: vscode.TreeItem): Thenable<vscode.TreeItem[]>;

	protected get treeData(): vscode.TreeItem[] {
		return this._treeData;
	}

	protected set treeData(treeData: vscode.TreeItem[]) {
		this._treeData = treeData;
	}

	protected fetchOrgList = async (): Promise<OrgDetails[]> => {
		const orgs = await this.sfExecutor.listOrgs();
		return orgs[this.ordType];
	};

	protected populateOrgDescription = (org: OrgDetails): OrgDetails => {
		org.description = `${org.alias} - ${org.username}`;
		return org;
	};

	abstract modifyOrgData(element: OrgDetails): OrgDetails;

	protected setOrgAccessStatus = (
		org: OrgDetails
	): OrgDetails => {
		org.accessStatus = org.connectedStatus === 'Connected' ? 'connected' : 'disconnected';
		return org;
	};

	protected setOrgIconName = (org: OrgDetails): OrgDetails => {
		if (!Object.hasOwn(org, 'iconName') || !org.iconName) {
			let connectionStatus = org.connectedStatus;
			if (!org.connectionStatus && org.status) {
				connectionStatus = org.status === 'Active' ? 'Connected' : 'Disconnected';
			}
	
			org.iconName = connectionStatus === 'Connected' ? 'connected' : 'disconnected';
		}

		return org;
	};

	protected populateOrgTree = async (orgsList: OrgDetails[], collapsibleState?: vscode.TreeItemCollapsibleState): Promise<OrgDependency[]> => {
		const treeDeps: OrgDependency[] = [];
		const treeCollapsibleState = collapsibleState || vscode.TreeItemCollapsibleState.None;

		for (const org of orgsList) {
			this.populateOrgDescription(org);
			this.setOrgAccessStatus(org);
			this.modifyOrgData(org);
			this.setOrgIconName(org);
			
			const treeItem = new OrgDependency(org.alias, this.ordType, org, treeCollapsibleState);
			treeDeps.push(treeItem);
		}

		this.treeData = treeDeps;

		return treeDeps;
	};
}
