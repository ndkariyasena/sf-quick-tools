import SfCommander from '../structure/sfCommander';

export default class SfExecutor extends SfCommander {
	async listOrgs() {
		const orgs = await this.execute('sf org list --json');

		return JSON.parse(orgs).result;
	}
}
