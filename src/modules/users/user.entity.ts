import { Entity } from "../../core/entity/entity";

export interface UserProps {
	id: string;
	login: string;
	email: string;
	password: string;
	age: number;
	about: string;
}

export class User extends Entity<string> {
	constructor(private props: UserProps) {
		super(props.id);
	}
}
