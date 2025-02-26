import { User } from "./entities/User";

describe("UserEntity", () => {
	let user: User;

	it("should create user entity without errors", async () => {
		const user = await User.create({
			login: "testlogin",
			email: "email@test.com",
			password: "password",
			age: 30,
			about: "about me",
		});
	});
});
