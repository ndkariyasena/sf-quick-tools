import * as vscode from 'vscode';

type TerminalExecutorResult = {
	output: string | undefined;
	outputMatched: boolean;
};

export const terminalExecutor = async (
	command: string,
	outputRegex?: string
): Promise<TerminalExecutorResult> => {
	return new Promise<TerminalExecutorResult>(async (resolve, reject) => {
		const terminal = vscode.window.createTerminal({
			name: 'SF Quick Tools', // Just a name for the terminal
			hideFromUser: true // This is the key: Hide the terminal
		});

		try {
			await waitForShellIntegration(terminal, 5000);
		} catch (e) {
			vscode.window.showErrorMessage((e as Error).message);
			reject((e as Error).message);
		}

		const execution = terminal.shellIntegration!.executeCommand(command);
		const terminalStream = execution.read();

		const regex = outputRegex ? new RegExp(outputRegex) : undefined;
		let outputMatched = false;
		let terminalResult = '';

		for await (const chunk of terminalStream) {
			terminalResult += chunk;

			if (regex) {
				for (const line of chunk.split('\n')) {
					const simplifiedLine = line.trim().replace(/\r|\t/g, '');
					if (regex.test(simplifiedLine)) {
						outputMatched = true;
						break;
					}
				}
			}
		}

		terminal.dispose();

		resolve({ output: terminalResult, outputMatched});
	});
};

async function waitForShellIntegration(
	terminal: vscode.Terminal,
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
		if (e.terminal === terminal) {
			clearTimeout(timer);
			listener.dispose();
			resolve();
		}
	});

	await promise;
}
