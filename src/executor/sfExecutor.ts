import SfCommander from "../structure/sfCommander";

export default class SfExecutor extends SfCommander {
	async listOrgs() {
		console.log('SF listOrgs');
		// const orgs = await this.execute('bash -lc "node -v"');
		const orgs = await this.execute('sf org list --json');

		console.log({orgs: JSON.parse(orgs).result});
		return JSON.parse(orgs).result;
	}
}
