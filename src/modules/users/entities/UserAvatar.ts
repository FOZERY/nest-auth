import { IsBoolean, IsDate, IsNotEmpty, IsString, IsUUID } from "class-validator";
import { randomUUID } from "crypto";
import { Entity } from "../../../core/entity/Entity";
import { Nullable } from "../../../core/types/utility.types";

export interface UserAvatarProps {
	id?: string;
	userId: string;
	path: string;
	active: boolean;
	createdAt?: Nullable<Date>;
	updatedAt?: Nullable<Date>;
	deletedAt?: Nullable<Date>;
}

export class UserAvatar extends Entity {
	@IsUUID()
	private _id: string;

	@IsUUID()
	private _userId: string;

	@IsNotEmpty()
	@IsString()
	private _path: string;

	@IsBoolean()
	private _active: boolean;

	@IsDate()
	private _createdAt: Nullable<Date>;

	@IsDate()
	private _updatedAt: Nullable<Date>;

	@IsDate()
	private _deletedAt: Nullable<Date>;

	private constructor(props: UserAvatarProps) {
		super();
		this._id = props.id ?? randomUUID();
		this._userId = props.userId;
		this._path = props.path;
		this._active = props.active;
		this._createdAt = props.createdAt ?? null;
		this._updatedAt = props.updatedAt ?? null;
		this._deletedAt = props.deletedAt ?? null;
	}

	public get id(): string {
		return this._id;
	}

	public get userId(): string {
		return this._userId;
	}

	public get path(): string {
		return this._path;
	}

	public get active(): boolean {
		return this._active;
	}

	public get createdAt(): Nullable<Date> {
		return this._createdAt;
	}

	public get updatedAt(): Nullable<Date> {
		return this._updatedAt;
	}

	public get deletedAt(): Nullable<Date> {
		return this._deletedAt;
	}

	public set deletedAt(deletedAt: Nullable<Date>) {
		this._deletedAt = deletedAt;
	}

	public static async create(props: UserAvatarProps): Promise<UserAvatar> {
		const userAvatar = new UserAvatar(props);
		await userAvatar.validate();
		return userAvatar;
	}
}
