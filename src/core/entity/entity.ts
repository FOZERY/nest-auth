export abstract class Entity<TId extends string | number> {
	protected id?: TId;

	constructor(id?: TId) {
		this.id = id;
	}

	protected async validate() {}
}
