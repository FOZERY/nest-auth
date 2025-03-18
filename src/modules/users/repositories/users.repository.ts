import {
	FindAllUsersWithPaginationInputDTO,
	FindAllUsersWithPaginationOutputDTO,
} from "../dto/users/repositories/find-all-users-w-pagination.dto";
import { User } from "../entities/User";
import { UserAvatar } from "../entities/UserAvatar";

export interface UsersRepository {
	isExists(id: string): Promise<boolean>;
	findAllWithPagination(
		dto: FindAllUsersWithPaginationInputDTO,
		withDeleted?: boolean
	): Promise<FindAllUsersWithPaginationOutputDTO>;
	findById(id: string, withDeleted?: boolean): Promise<User | null>;
	findByLogin(login: string, withDeleted?: boolean): Promise<User | null>;
	findByEmail(email: string, withDeleted?: boolean): Promise<User | null>;
	create(user: User): Promise<void>;
	update(user: User): Promise<void>;
	softDeleteById(id: string): Promise<void>;
	findAvatarById(id: string): Promise<UserAvatar | null>;
	findActiveUserAvatar(userId: string): Promise<UserAvatar | null>;
	findNonDeletedUserAvatars(userId: string): Promise<UserAvatar[]>;
	createAvatar(avatar: UserAvatar): Promise<void>;
	softRemoveAvatarById(id: string): Promise<void>;
	updateAvatarActiveStatusById(avatarId: string, isActive: boolean): Promise<void>;
}
