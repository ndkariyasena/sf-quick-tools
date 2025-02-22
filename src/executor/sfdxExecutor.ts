import SfCommander from '../structure/sfCommander';

export default class SfDxExecutor extends SfCommander {
	async listOrgs() {
		const orgs = await this.execute('sfdx force:org:list --json');

		return JSON.parse(orgs).result;
	}

	async deployScratchOrg(orgName: string) {
		const response = await this.executeInTerminal(`sfdx force:source:push --target-org ${orgName}`);

		return response;
	}
}
