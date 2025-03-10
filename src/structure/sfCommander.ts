import * as vscode from 'vscode';
import { execute } from '../utils/utils';
import { OrgsList } from '../sfqtTypes';
import Terminal from '../utils/terminal';

/* This abstract class is a the blueprint for sfdx and sf CLI commands executor classes */
export default abstract class SfCommander {
	private isNvmAvailable: boolean = false;
	private _terminal: Terminal | undefined;

	constructor(isNvmAvailable: boolean) {
		this.isNvmAvailable = isNvmAvailable;
	}

	private async createTerminal(): Promise<void> {
		this._terminal = await Terminal.getInstance();

		await this._terminal.isTerminalAvailable();
	}

	private async getTerminal(): Promise<Terminal | undefined> {
		if (!this._terminal) {
			await this.createTerminal();
		}
		return Promise.resolve(this._terminal);
	}

	private populateCliCommand(command: string): string {
		const nvmActivate =
			'export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && nvm use default';

		let cliCommand = command;

		if (this.isNvmAvailable) {
			cliCommand = `bash -lc "${nvmActivate} && ${cliCommand}"`;
		}

		return cliCommand;
	}

	private isCliWarning(output: string): boolean {
		const warningRegex = /(WARNING|Warning):/g;
		return warningRegex.test(output);
	}

	private cleanOutput(output: string): string {
		const nvmRegex = /^Now using node v\d+\.\d+\.\d+ \(npm v\d+\.\d+\.\d+\)/g;
		if (this.isNvmAvailable && nvmRegex.test(output)) {
			return output.replace(nvmRegex, '');
		} else {
			return output;
		}
	}

	/* This method executes the command and returns the result */
	async execute(command: string): Promise<string> {
		const cliCommand = this.populateCliCommand(command);
		
		const root = vscode.workspace?.workspaceFolders
			? vscode.workspace.workspaceFolders[0].uri.fsPath
			: undefined;
			
		return await execute(cliCommand, { cwd: root })
			.then((result) => {
				if (result.stderr && !this.isCliWarning(result.stderr)) {
					console.error({ error: result.stderr });
					throw new Error(result.stderr);
				} else {
					return this.cleanOutput(result.stdout);
				}
			});
	}

	async listOrgs(): Promise<OrgsList> {
		throw new Error('Method not implemented.');
	}

	async deployScratchOrg(orgName: string): Promise<string | undefined> {
		throw new Error('Method not implemented.');
	}

	async executeInTerminal(command: string): Promise<string | undefined> {
		const terminal = await this.getTerminal();

		if (!terminal) {
			throw new Error('Could not create terminal instance');
		}

		return await terminal.executeCommand(command);
	}
}
