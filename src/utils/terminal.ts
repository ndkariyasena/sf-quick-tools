import * as vscode from 'vscode';
import { TerminalName } from './constants';

/**
 * Terminal class to handle terminal operations
 * 
 *
 * @class Terminal
 */

export default class Terminal {
	private static _instance: Terminal | undefined;
	private static _terminal: vscode.Terminal | undefined;

	private constructor(name = TerminalName, hideFromUser = false, options = {}) {
		this.createTerminal(name, hideFromUser, options);
	}

	public static async getInstance(name = TerminalName, hideFromUser = false, options = {}): Promise<Terminal> {
		if (!Terminal._instance) {
			Terminal._instance = await new Terminal(name, hideFromUser, options);
		}
		return Terminal._instance;
	}

	private async createTerminal(
		name = TerminalName,
		hideFromUser = false,
		options = {}
	): Promise<vscode.Terminal> {
		return new Promise<vscode.Terminal>(async (resolve) => {
			if (Terminal._terminal) {
				resolve(Terminal._terminal);
			} else {
				const terminal = vscode.window.createTerminal({
					name,
					hideFromUser,
					...options,
				});
				
				Terminal._terminal = terminal;

				resolve(Terminal._terminal);
			}
		});
	}

	async isTerminalAvailable(): Promise<boolean> {
		try {
			await this.waitForShellIntegration(5000);
			return true;
		} catch (e) {
			Terminal._terminal = undefined;
			vscode.window.showErrorMessage((e as Error).message);
			throw new Error((e as Error).message);
		}
	}

	private async waitForShellIntegration(
		timeout: number
	): Promise<void> {
		let resolve: () => void;
		let reject: (e: Error) => void;

		const promise = new Promise<void>((_resolve, _reject) => {
			resolve = _resolve;
			reject = _reject;
		});

		const timer = setTimeout(
			() =>
				reject(
					new Error(
						'Could not run terminal command: shell integration is not enabled'
					)
				),
			timeout
		);

		const listener = vscode.window.onDidChangeTerminalShellIntegration((e) => {
			if (e.terminal === Terminal._terminal) {
				clearTimeout(timer);
				listener.dispose();
				resolve();
			}
		});

		await promise;
	}

	public async executeCommand(command: string): Promise<string | undefined> {
		return new Promise<string | undefined>(async (resolve, reject) => {
			if (!Terminal._terminal) {
				reject('Terminal not found');
			} else {
				const execution = Terminal._terminal.shellIntegration!.executeCommand(command);
				const terminalStream = execution.read();
	
				let output = '';
	
				for await (const chunk of terminalStream) {
					output += chunk;
				}
	
				resolve(output);
			}
		});
	}
}
