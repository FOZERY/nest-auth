import { IsDate, IsInt, IsIP, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { Entity } from "../../../core/entity/Entity";
import { Nullable } from "../../../core/types/utility.types";

export interface RefreshSessionProps {
	id?: number;
	userId: string;
	refreshToken: string;
	fingerprint: string;
	ipAddress: string;
	userAgent?: Nullable<string>;
	expiresIn: number;
	createdAt?: Nullable<Date>;
}

export class RefreshSession extends Entity<number> {
	@IsUUID()
	private _refreshToken: string;

	@IsUUID()
	private _userId: string;

	@IsNotEmpty()
	@IsString()
	private _fingerprint: string;

	@IsIP()
	private _ipAddress: string;

	@IsOptional()
	@IsNotEmpty()
	@IsString()
	private _userAgent: Nullable<string>;

	@IsInt()
	private _expiresIn: number;

	@IsOptional()
	@IsDate()
	private _createdAt: Nullable<Date>;

	private constructor(props: RefreshSessionProps) {
		super(props.id);

		this._refreshToken = props.refreshToken;
		this._userId = props.userId;
		this._fingerprint = props.fingerprint;
		this._ipAddress = props.ipAddress;
		this._userAgent = props.userAgent ?? null;
		this._expiresIn = props.expiresIn;
		this._createdAt = props.createdAt ?? null;
	}

	public get id() {
		return this._id;
	}

	public get refreshToken(): string {
		return this._refreshToken;
	}

	public get userId(): string {
		return this._userId;
	}

	public get fingerprint(): string {
		return this._fingerprint;
	}

	public get ipAddress(): string {
		return this._ipAddress;
	}

	public get userAgent(): Nullable<string> {
		return this._userAgent;
	}

	public get expiresIn(): number {
		return this._expiresIn;
	}

	public get createdAt(): Nullable<Date> {
		return this._createdAt;
	}

	public static async create(props: RefreshSessionProps) {
		const refreshSession = new RefreshSession(props);
		await refreshSession.validate();
		return refreshSession;
	}
}
