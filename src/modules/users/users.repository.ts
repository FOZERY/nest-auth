import { User } from "./user.entity";

export interface UsersRepository {
	findByLogin(login: string): Promise<User | null>;
	create(user: User): Promise<void>;
}
