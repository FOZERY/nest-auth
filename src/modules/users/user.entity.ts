import { IsDate, IsEmail, IsNumber, IsString, Max, MaxLength, Min } from "class-validator";
import { Entity } from "../../core/entity/entity";

export interface UserProps {
	id?: string;
	login: string;
	email: string;
	password: string;
	age: number;
	about?: string;
	createdAt?: Date;
	updatedAt?: Date;
	deletedAt?: Date;
}

export class User extends Entity {
	@IsString()
	@MaxLength(255)
	private _login: string;

	@IsEmail()
	private _email: string;

	@IsString()
	private _hashedPassword: string;

	@IsNumber()
	@Max(150)
	@Min(0)
	private _age: number;

	@IsString()
	@MaxLength(1000)
	private _about?: string;

	@IsDate()
	private _updatedAt?: Date;

	@IsDate()
	private _createdAt?: Date;

	@IsDate()
	private _deletedAt?: Date;

	private constructor(props: UserProps) {
		super(props.id);

		this._login = props.login;
		this._email = props.email;
		this._hashedPassword = props.password;
		this._age = props.age;
		this._about = props.about;
		this._createdAt = props.createdAt;
		this._updatedAt = props.updatedAt;
		this._deletedAt = props.deletedAt;
	}

	public static async create(props: UserProps): Promise<User> {
		const user = new User(props);
		await this.validate(user);

		return user;
	}
}
