import { User } from "./user.entity";

export interface UsersRepository {
	findById(id: string): Promise<User | null>;
	findByLogin(login: string): Promise<User | null>;
	findByEmail(email: string): Promise<User | null>;
	create(user: User): Promise<void>;
}
