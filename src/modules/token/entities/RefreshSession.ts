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
	public refreshToken: string;

	@IsUUID()
	public userId: string;

	@IsNotEmpty()
	@IsString()
	@MaxLength(255)
	public fingerprint: string;

	@IsOptional()
	@IsIP()
	public ipAddress: Nullable<string>;

	@IsOptional()
	@IsNotEmpty()
	@IsString()
	@MaxLength(255)
	public userAgent: Nullable<string>;

	@IsDate()
	public expiresAt: Date;

	@IsDate()
	public createdAt: Date;

	private constructor(props: RefreshSessionProps) {
		super();

		this.refreshToken = props.refreshToken;
		this.userId = props.userId;
		this.fingerprint = props.fingerprint;
		this.ipAddress = props.ipAddress ?? null;
		this.userAgent = props.userAgent ?? null;
		this.expiresAt = props.expiresAt;
		this.createdAt = props.createdAt ?? new Date();
	}

	public get expiresInMs(): number {
		return this.expiresAt.getTime() - Date.now();
	}

	public static async create(props: RefreshSessionProps) {
		const refreshSession = new RefreshSession(props);
		await refreshSession.validate();
		return refreshSession;
	}

	public isExpired(): boolean {
		return Date.now() - this.expiresAt.getTime() >= 0;
	}

	public toJSON(): string {
		return JSON.stringify({
			refreshToken: this.refreshToken,
			userId: this.userId,
			expiresAt: this.expiresAt,
			createdAt: this.createdAt,
			fingerprint: this.fingerprint,
			ipAddress: this.ipAddress,
			userAgent: this.userAgent,
		});
	}
}
