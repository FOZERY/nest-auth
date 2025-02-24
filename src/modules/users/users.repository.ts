import { User } from "./user.entity";

export interface UsersRepository {
	findByLogin(login: string): Promise<User | null>;
	findByEmail(email: string): Promise<User | null>;
	create(user: User): Promise<void>;
}
