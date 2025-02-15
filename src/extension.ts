// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import SfTreeDataProvider from "./sfTreeDataProvider";
// import { TerminalShellExecutionCommandLine } from "vscode";
import { isNvmInstalled, getAvailableSfExecutor } from "./utils/utils";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log(
		'Congratulations, your extension "sf-quick-tools" is now active!'
	);

	/* const terminal = vscode.window.createTerminal(`Ext Terminal #SFQT`, "zsh");
	terminal.hide();
	terminal.sendText("nvm current");
	vscode.window.onDidEndTerminalShellExecution((e) => {
		console.log(e);
	}); */
	// terminal.show();
	// Get the salesforce CLI provider
	const isNvmAvailable = await isNvmInstalled();
	const sfCommandExecutor = await getAvailableSfExecutor(isNvmAvailable);

	// Register the custom tree
	const treeDataProvider = new SfTreeDataProvider(sfCommandExecutor);
	vscode.window.registerTreeDataProvider("SFQuickToolsOrgs", treeDataProvider);

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand(
		"sf-quick-tools.helloWorld",
		() => {
			// The code you place here will be executed every time your command is executed
			// Display a message box to the user
			vscode.window.showInformationMessage("Hello World from sf-quick-tools!");
		}
	);

	context.subscriptions.push(disposable);

	// Activate the custom tree
	vscode.commands.executeCommand("setContext", "sfqtActive", true);
}

// This method is called when your extension is deactivated
export function deactivate() {}
