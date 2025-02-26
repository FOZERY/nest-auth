import { User } from "./user.entity";

export interface UsersRepository {
	findById(id: string, withDeleted?: boolean): Promise<User | null>;
	findByLogin(login: string, withDeleted?: boolean): Promise<User | null>;
	findByEmail(email: string, withDeleted?: boolean): Promise<User | null>;
	create(user: User): Promise<void>;
	update(user: User): Promise<void>;
	deleteById(id: string): Promise<void>;
}
