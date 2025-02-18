import * as vscode from 'vscode';
import TreeDataProvider from '../../structure/treeDataProvider';
import { OrgDetails, OrgTypes } from '../../sfqtTypes';
import OrgDependency from '../dependency/orgsDependency';

export default class ScratchOrgDataProvider extends TreeDataProvider {

	protected readonly ordType: OrgTypes = 'scratchOrgs';

	constructor(sfCommandExecutor: any) {
		super();
		this.sfExecutor = sfCommandExecutor;
	}

	registerCommands(): void {
		vscode.commands.registerCommand('sfqt.deploy', this.deployOrg.bind(this));
	}

	setContext(): void {
		vscode.commands.executeCommand('setContext', 'sfqtScratchOrgs', true);
	}

	modifyOrgData(element: OrgDetails): OrgDetails {
		if (element.isDefaultUsername && element.defaultMarker) {
			element.iconName = 'activeScratchOrg';
			element.activeScratchOrg = true;
		}
		element._id = `${element.alias}-${element.username}`;

		element.tooltip = `Expires: ${element.expirationDate}`;

		return element;
	}

	setOrgAccessStatus = (
		org: OrgDetails
	): OrgDetails => {
		org.accessStatus = org.status === 'Active' ? 'connected' : 'disconnected';
		return org;
	};

	async getChildren(element?: OrgDependency): Promise<OrgDependency[]> {

		if (element) {
			return Promise.resolve([]);
		}

		const devOrgs = await this.fetchOrgList();

		const treeDeps: OrgDependency[] = await this.populateOrgTree(devOrgs, vscode.TreeItemCollapsibleState.None);

		return Promise.resolve(treeDeps);
	}

	async deployOrg(org: OrgDependency): Promise<void> {
		const { id, label } = org;
		const treeDeps: OrgDependency[] = [ ...this.treeData ];
		const selectedTreeDep = treeDeps.find((treeDep) => treeDep.id === id);

		if (!selectedTreeDep) {
			vscode.window.showErrorMessage(`Something went wrong. Could not find ${label}`);
			return;
		}

		let continueProcess = true;

		if (!selectedTreeDep.orgDetails.activeScratchOrg) {
			continueProcess = false;
			vscode.window.showWarningMessage(`"${label}" is not an active scratch org.`);

			const result = await vscode.window.showInputBox({
				title: 'This is not the active scratch org. Do you want to deploy it?',
				prompt: 'Please type "Yes" or "No"',
				placeHolder: 'Yes / No',
			});

			continueProcess = result && result.toUpperCase().match(/(Y)+(ES)?/g) ? true : false;
		}

		if (!continueProcess) {
			vscode.window.showInformationMessage('Deploy process cancelled.');
			return;
		}

		vscode.window.showInformationMessage(`Deploying ${label}`);

		await this.sfExecutor.deployScratchOrg(selectedTreeDep.orgDetails.username);

		vscode.window.showInformationMessage(`Deployment process completed for ${label}`);
	}
}
