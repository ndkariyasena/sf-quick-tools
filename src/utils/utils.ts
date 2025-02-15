import { exec } from "child_process";
import { promisify } from "util";
import SfDxExecutor from "../executor/sfdxExecutor";
import SfExecutor from "../executor/sfExecutor";
import { terminalExecutor } from "../executor/terminalWrapper";
import SfCommander from "../structure/sfCommander";

export const execute = promisify(exec);

export const isNvmInstalled = async (): Promise<boolean> => {
	return await terminalExecutor("nvm --version", "\\d+\\.\\d+\\.\\d+")
		.then(({ outputMatched }) => outputMatched)
		.catch(() => false);
};

export const getAvailableSfExecutor = async (isNvmAvailable = false): Promise<SfCommander> => {
	const sfVersionRegex = "^@salesforce\\/cli\\/\\d+\\.\\d+\\.\\d+";
	const sfdxVersionRegex = "^sfdx-cli\\/\\d+\\.\\d+\\.\\d+";

	let sfExecutor: SfCommander | null = null;

	// await bashTest();

	return await terminalExecutor("sf --version", sfVersionRegex)
		.then(({ outputMatched }) => {
			if (outputMatched) {
				console.debug("[SfQT] sf CLI is installed");
				sfExecutor = new SfExecutor(isNvmAvailable);

				return sfExecutor;
			} else {
				throw new Error("sf CLI not found");
			}
		})
		.catch(async () => {
			return await terminalExecutor("sfdx --version", sfdxVersionRegex)
				.then(({ outputMatched }) => {
					if (outputMatched) {
						console.debug("[SfQT] sfdx CLI is installed");
						sfExecutor = new SfDxExecutor(isNvmAvailable);

						return sfExecutor;
					} else {
						throw new Error("sfdx CLI not found");
					}
				})
				.catch(() => {
					throw new Error("Neither sf nor sfdx CLI is installed");
				});
		});
};

const bashTest = async () => {
	/* exec(
		'export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && sf org list',
		{ shell: "/bin/bash" },
		(error, stdout, stderr) => {
			if (error) {
				console.error(`Error: ${error.message}`);
				return;
			}
			if (stderr) {
				console.error(`stderr: ${stderr}`);
				return;
			}
			console.log(`stdout: ${stdout}`);
		}
	); */

	const command = 'export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && nvm use default && nvm current';
	let commandWithLoginShell = `bash -lc "${command} && sf --version"`;

	// await execute('bash -lc "export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && nvm --version')
	await execute(
		commandWithLoginShell
		// 'export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && nvm --version && nvm current && nvm ls'
		// 'export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && nvm --version && nvm current && sf --version'
	)
		.then((res) => {
			console.log(1);
			console.log({ res });
		})
		.catch((err) => {
			console.log(2);
			console.error({ err });
		});

	await execute('bash -lc "nvm --version"')
		.then((res) => {
			console.log(1);
			console.log({ res });
		})
		.catch((err) => {
			console.log(2);
			console.error({ err });
		});
};
