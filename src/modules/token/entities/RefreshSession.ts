import { IsDate, IsIP, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from "class-validator";
import { Entity } from "../../../core/entity/Entity";
import { Nullable } from "../../../core/types/utility.types";

export interface RefreshSessionProps {
	userId: string;
	refreshToken: string;
	fingerprint: string;
	ipAddress?: Nullable<string>;
	userAgent?: Nullable<string>;
	expiresAt: Date;
	createdAt?: Nullable<Date>;
}

export class RefreshSession extends Entity {
	@IsUUID()
	private _refreshToken: string;

	@IsUUID()
	private _userId: string;

	@IsNotEmpty()
	@IsString()
	@MaxLength(255)
	private _fingerprint: string;

	@IsOptional()
	@IsIP()
	private _ipAddress: Nullable<string>;

	@IsOptional()
	@IsNotEmpty()
	@IsString()
	@MaxLength(255)
	private _userAgent: Nullable<string>;

	@IsDate()
	private _expiresAt: Date;

	@IsOptional()
	@IsDate()
	private _createdAt: Nullable<Date>;

	public toJSON() {
		return JSON.stringify({
			refreshToken: this.refreshToken,
			userId: this.userId,
			fingerprint: this.fingerprint,
			ipAddress: this.ipAddress,
			userAgent: this.userAgent,
			expiresAt: this.expiresAt,
			createdAt: this.createdAt,
		});
	}

	private constructor(props: RefreshSessionProps) {
		super();

		this._refreshToken = props.refreshToken;
		this._userId = props.userId;
		this._fingerprint = props.fingerprint;
		this._ipAddress = props.ipAddress ?? null;
		this._userAgent = props.userAgent ?? null;
		this._expiresAt = props.expiresAt;
		this._createdAt = props.createdAt ?? null;
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

	public get ipAddress(): Nullable<string> {
		return this._ipAddress;
	}

	public get userAgent(): Nullable<string> {
		return this._userAgent;
	}

	public get expiresAt(): Date {
		return this._expiresAt;
	}

	public get expiresInMs(): number {
		return this._expiresAt.getTime() - Date.now();
	}

	public get createdAt(): Nullable<Date> {
		return this._createdAt;
	}

	public static async create(props: RefreshSessionProps) {
		const refreshSession = new RefreshSession(props);
		await refreshSession.validate();
		return refreshSession;
	}

	public isExpired(): boolean {
		return Date.now() - this._expiresAt.getTime() >= 0;
	}
}
