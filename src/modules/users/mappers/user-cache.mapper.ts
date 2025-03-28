import { User } from "../entities/User";

export class UserCacheMapper {
	public static toCache(user: User): string {
		return JSON.stringify({
			id: user.id,
			about: user.about,
			age: user.age,
			createdAt: user.createdAt,
			activeAvatar: user.getActiveAvatar(),
			email: user.email,
			login: user.login,
		});
	}
}
