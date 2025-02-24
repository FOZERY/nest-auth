import { EntityWithGeneratedId } from "./GeneratedEntity";
export abstract class Entity<TId extends number | string> extends EntityWithGeneratedId<TId> {
	protected _id: TId;

	constructor(id: TId) {
		super();
		this._id = id;
	}

	public get id(): TId {
		return this._id;
	}
}
