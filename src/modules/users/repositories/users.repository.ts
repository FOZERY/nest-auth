import {
	FindAllUsersWithPaginationInputDTO,
	FindAllUsersWithPaginationOutputDTO,
} from "../dto/users/repositories/find-all-users-w-pagination.dto";
import { User } from "../entities/User";
import { UserAvatar } from "../entities/UserAvatar";
import { FindUserOptions } from "../interfaces/find-user-options";

export interface UsersRepository {
	exists(userId: string): Promise<boolean>;
	findAllWithPagination(
		dto: FindAllUsersWithPaginationInputDTO,
		options: FindUserOptions
	): Promise<FindAllUsersWithPaginationOutputDTO>;
	findByUserId(userId: string, options: FindUserOptions): Promise<User | null>;
	findByLogin(login: string, options: FindUserOptions): Promise<User | null>;
	findByEmail(email: string, options: FindUserOptions): Promise<User | null>;
	create(user: User): Promise<void>;
	update(user: User): Promise<void>;
	softDeleteByUserId(userId: string): Promise<void>;
	findAvatarByUserId(userId: string): Promise<UserAvatar | null>;
	findActiveUserAvatarByUserId(userId: string): Promise<UserAvatar | null>;
	findUserAvatarsByUserId(userId: string): Promise<UserAvatar[]>;
	createUserAvatar(avatar: UserAvatar): Promise<void>;
	softRemoveAvatarByAvatarId(avatarId: string): Promise<void>;
	updateAvatarActiveStatusByAvatarId(avatarId: string, isActive: boolean): Promise<void>;
}
