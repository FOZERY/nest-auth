import {
	FindAllUsersWithPaginationInputDTO,
	FindAllUsersWithPaginationOutputDTO,
} from "../dto/users/repositories/find-all-users-w-pagination.dto";
import { User } from "../entities/User";
import { UserAvatar } from "../entities/UserAvatar";

export interface UsersRepository {
	findAllWithPagination(
		dto: FindAllUsersWithPaginationInputDTO,
		withDeleted?: boolean
	): Promise<FindAllUsersWithPaginationOutputDTO>;
	findById(id: string, withDeleted?: boolean): Promise<User | null>;
	findByLogin(login: string, withDeleted?: boolean): Promise<User | null>;
	findByEmail(email: string, withDeleted?: boolean): Promise<User | null>;
	create(user: User): Promise<void>;
	update(user: User): Promise<void>;
	deleteById(id: string): Promise<void>;
	createAvatar(avatar: UserAvatar): Promise<void>;
}
