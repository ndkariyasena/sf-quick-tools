import SfCommander from "../structure/sfCommander";

export default class SfDxExecutor extends SfCommander {
	async listOrgs() {
		console.log('SFDX listOrgs');
		const orgs = await this.execute("sfdx force:org:list --json");

		console.log({ orgs });
		return JSON.parse(orgs).result;
	}
}
