import SfCommander from '../structure/sfCommander';

export default class SfExecutor extends SfCommander {
	async listOrgs() {
		const orgs = await this.execute('sf org list --json');

		return JSON.parse(orgs).result;
	}

	async deployScratchOrg(orgName: string) {
		const response = await this.executeInTerminal(`sf project deploy preview --target-org ${orgName}`); // TODO: Change to deploy
		// const response = await this.executeInTerminal(`sf project deploy start --target-org ${orgName}`);

		return response;
	}

	async previewScratchOrg(orgName: string) {
		const response = await this.executeInTerminal(`sf project deploy preview --target-org ${orgName}`);

		return response;
	}
}
