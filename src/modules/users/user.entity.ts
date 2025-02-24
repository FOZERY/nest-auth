import argon, { argon2id } from "argon2";
import { IsDate, IsEmail, IsNumber, IsString, Max, MaxLength, Min } from "class-validator";
import { randomUUID } from "crypto";
import { Entity } from "../../core/entity/entity";
import { Nullable } from "../../core/types/utility.types";
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

export class User extends Entity<string> {
	@IsString()
	@MaxLength(255)
	private _login: string;

	@IsEmail()
	private _email: string;

	@IsString()
	private _password: string;

	@IsNumber()
	@Max(150)
	@Min(0)
	private _age: number;

	@IsString()
	@MaxLength(1000)
	private _about: Nullable<string>;

	@IsDate()
	private _updatedAt: Nullable<Date>;

	@IsDate()
	private _createdAt: Nullable<Date>;

	@IsDate()
	private _deletedAt: Nullable<Date>;

	private constructor(props: UserProps) {
		super(props.id ?? randomUUID());

		this._login = props.login;
		this._email = props.email;
		this._password = props.password;
		this._age = props.age;
		this._about = props.about ?? null;
		this._createdAt = props.createdAt ?? null;
		this._updatedAt = props.updatedAt ?? null;
		this._deletedAt = props.deletedAt ?? null;
	}

	public get login(): string {
		return this._login;
	}

	public get email(): string {
		return this._email;
	}

	public get password(): string {
		return this._password;
	}

	public get age(): number {
		return this._age;
	}

	public get about(): Nullable<string> {
		return this._about;
	}

	public async hashPassword() {
		this._password = await argon.hash(this._password, {
			type: argon2id,
		});
	}

	public static async create(props: UserProps): Promise<User> {
		const user = new User(props);
		await user.validate();
		await user.hashPassword();

		return user;
	}
}
