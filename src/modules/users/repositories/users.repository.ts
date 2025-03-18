import {
	FindAllUsersWithPaginationInputDTO,
	FindAllUsersWithPaginationOutputDTO,
} from "../dto/users/repositories/find-all-users-w-pagination.dto";
import { User } from "../entities/User";
import { UserAvatar } from "../entities/UserAvatar";

export interface UsersRepository {
	ifExists(userId: string): Promise<boolean>;
	findAllWithPagination(
		dto: FindAllUsersWithPaginationInputDTO,
		withDeleted?: boolean
	): Promise<FindAllUsersWithPaginationOutputDTO>;
	findByUserId(userId: string, withDeleted?: boolean): Promise<User | null>;
	findByLogin(login: string, withDeleted?: boolean): Promise<User | null>;
	findByEmail(email: string, withDeleted?: boolean): Promise<User | null>;
	create(user: User): Promise<void>;
	update(user: User): Promise<void>;
	softDeleteByUserId(userId: string): Promise<void>;
	findAvatarByUserId(userId: string): Promise<UserAvatar | null>;
	findActiveUserAvatarByUserId(userId: string): Promise<UserAvatar | null>;
	findNonDeletedUserAvatarsByUserId(userId: string): Promise<UserAvatar[]>;
	createUserAvatar(avatar: UserAvatar): Promise<void>;
	softRemoveAvatarByAvatarId(avatarId: string): Promise<void>;
	updateAvatarActiveStatusByAvatarId(avatarId: string, isActive: boolean): Promise<void>;
}
