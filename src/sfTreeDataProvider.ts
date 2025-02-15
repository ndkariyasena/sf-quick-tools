import * as vscode from "vscode";
import SfCommander from "./structure/sfCommander";
import Dependency from "./structure/treeDependency";

export default class SfTreeDataProvider implements vscode.TreeDataProvider<Dependency> {
	private _onDidChangeTreeData: vscode.EventEmitter<Dependency | undefined> =
		new vscode.EventEmitter<Dependency | undefined>();

	readonly onDidChangeTreeData: vscode.Event<Dependency | undefined> =
		this._onDidChangeTreeData.event;

	private sfExecutor: SfCommander;
	
	constructor(sfCommandExecutor: SfCommander) {
		console.log('SfTreeDataProvider');
		this.sfExecutor = sfCommandExecutor;
	}

	refresh(): void {
		this._onDidChangeTreeData.fire(undefined);
	}

	getTreeItem(element: Dependency): vscode.TreeItem {
		return element;
	}

	getChildren(element?: Dependency): Thenable<Dependency[]> {
		console.log('getChildren');
		console.log({ element });
		this.sfExecutor.listOrgs().then((orgs) => {
			console.log({ orgs });
		});
		
		if (element) {
			return Promise.resolve([]);
		}
		return Promise.resolve([]);
	}
}
