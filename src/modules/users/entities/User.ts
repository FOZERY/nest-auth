import argon, { argon2id } from "argon2";
import {
	IsDate,
	IsEmail,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	IsUUID,
	Matches,
	Max,
	MaxLength,
	Min,
	MinLength,
} from "class-validator";
import { randomUUID } from "crypto";
import { NoSpaces } from "../../../common/class-validator/noSpaces.decorator";
import { Entity } from "../../../core/entity/Entity";
import { Nullable } from "../../../core/types/utility.types";

export interface UserProps {
	id?: string;
	login: string;
	email: string;
	password: string;
	age: number;
	about?: Nullable<string>;
	createdAt?: Nullable<Date>;
	updatedAt?: Nullable<Date>;
	deletedAt?: Nullable<Date>;
}

export class User extends Entity {
	@IsUUID()
	private _id: string;

	@IsNotEmpty()
	@IsString()
	@NoSpaces()
	@Matches(/^[a-zA-Z0-9_-]*$/, {
		message: "The string should not contain special characters",
	})
	@MinLength(3)
	@MaxLength(255)
	private _login: string;

	@IsNotEmpty()
	@IsEmail()
	@MaxLength(255)
	private _email: string;

	@IsNotEmpty()
	@IsString()
	@MaxLength(255)
	private _password: string;

	@IsNotEmpty()
	@IsNumber()
	@Max(150)
	@Min(0)
	private _age: number;

	@IsOptional()
	@IsString()
	@MaxLength(1000)
	private _about: Nullable<string>;

	@IsOptional()
	@IsDate()
	private _updatedAt: Nullable<Date>;

	@IsOptional()
	@IsDate()
	private _createdAt: Nullable<Date>;

	@IsOptional()
	@IsDate()
	private _deletedAt: Nullable<Date>;

	private constructor(props: UserProps) {
		super();
		this._id = props.id ?? randomUUID();
		this._login = props.login;
		this._email = props.email;
		this._password = props.password;
		this._age = props.age;
		this._about = props.about ?? null;
		this._createdAt = props.createdAt ?? null;
		this._updatedAt = props.updatedAt ?? null;
		this._deletedAt = props.deletedAt ?? null;
	}

	public get id(): string {
		return this._id;
	}

	public get login(): string {
		return this._login;
	}

	public async setLogin(login: string) {
		this._login = login;
		await this.validate();
	}

	public get email(): string {
		return this._email;
	}

	public async setEmail(email: string) {
		this._email = email;
		await this.validate();
	}

	public get password(): string {
		return this._password;
	}

	public async setPassword(password: string) {
		this._password = password;
		await this.validate();
		await this.hashPassword();
	}

	public get age(): number {
		return this._age;
	}

	public async setAge(age: number) {
		this._age = age;
		await this.validate();
	}

	public get about(): Nullable<string> {
		return this._about;
	}

	public async setAbout(about: string) {
		this._about = about;
		await this.validate();
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

	private async hashPassword() {
		if (this._password.startsWith("$argon2")) {
			return;
		}

		this._password = await argon.hash(this._password, {
			type: argon2id,
		});
	}

	public async comparePassword(nonhashedPassword: string) {
		return await argon.verify(this._password, nonhashedPassword);
	}

	public static async create(props: UserProps): Promise<User> {
		const user = new User(props);
		await user.validate();
		await user.hashPassword();

		return user;
	}
}
