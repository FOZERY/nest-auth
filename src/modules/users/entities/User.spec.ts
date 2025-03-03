import argon2 from "argon2";
import { randomUUID } from "crypto";
import { User, UserProps } from "./User";

describe("User", () => {
	let user: User;

	const createValidProps = () => ({
		login: "testlogin",
		email: "email@test.com",
		password: "password",
		age: 30,
	});

	describe("Creating valid user", () => {
		it("should create a valid user without optional fields", async () => {
			const props = createValidProps();
			user = await User.create(props);

			expect(user).toBeInstanceOf(User);
			expect(user.login).toBe(props.login);
			expect(user.email).toBe(props.email);
			expect(user.age).toBe(props.age);
			expect(user.about).toBeNull();
			expect(user.createdAt).toBeNull();
			expect(user.password).not.toBe(props.password); // hashed password
			await expect(argon2.verify(user.password, props.password)).resolves.toBe(true); // check that password is hashed with Argon2
		});

		it("should create a valid user with optional fields", async () => {
			const props: UserProps = {
				...createValidProps(),
				id: randomUUID(),
				password: "password",
				about: "about",
				createdAt: new Date(),
			};
			user = await User.create(props);

			expect(user).toBeInstanceOf(User);
			expect(user.id).toBe(props.id);
			expect(user.login).toBe(props.login);
			expect(user.email).toBe(props.email);
			expect(user.age).toBe(props.age);
			expect(user.about).toBe(props.about);
			expect(user.createdAt).toBe(props.createdAt);
			expect(user.password).not.toBe(props.password); // hashed password equal to the one passed
			await expect(argon2.verify(user.password, props.password)).resolves.toBe(true); // check that password is hashed with Argon2
		});

		it("shouldn't hash password if it already hashed", async () => {
			const nonhashedPassword = "password";
			const props: UserProps = {
				...createValidProps(),
				password: await argon2.hash(nonhashedPassword),
			};
			user = await User.create(props);

			expect(user.password).toBe(props.password); // hashed password equal to the one passed
			await expect(argon2.verify(user.password, nonhashedPassword)).resolves.toBe(true); // check that password is hashed with Argon2
		});
	});

	describe("Validation", () => {});

	describe("User methods", () => {
		let user: User;
		const validProps = createValidProps();

		beforeEach(async () => {
			user = await User.create(validProps);
		});

		describe("Password comparison", () => {
			it("should return true when comparing with correct password", async () => {
				await expect(user.comparePassword(validProps.password)).resolves.toBe(true);
			});

			it("should return false when comparing with incorrect password", async () => {
				await expect(user.comparePassword("wrongpassword")).resolves.toBe(false);
			});
		});

		describe("Setters", () => {
			it("should update login", async () => {
				const newLogin = "newlogin";
				await user.setLogin(newLogin);
				expect(user.login).toBe(newLogin);
			});

			it("should update email", async () => {
				const newEmail = "new@test.com";
				await user.setEmail(newEmail);
				expect(user.email).toBe(newEmail);
			});

			it("should update and hash password", async () => {
				const newPassword = "newpassword";
				await user.setPassword(newPassword);
				expect(user.password).not.toBe(newPassword);
				await expect(user.comparePassword(newPassword)).resolves.toBe(true);
			});

			it("should update age", async () => {
				const newAge = 25;
				await user.setAge(newAge);
				expect(user.age).toBe(newAge);
			});

			it("should update about", async () => {
				const newAbout = "new about info";
				await user.setAbout(newAbout);
				expect(user.about).toBe(newAbout);
			});
		});

		describe("Validation", () => {
			it("should throw error for invalid email format", async () => {
				await expect(user.setEmail("invalid-email")).rejects.toThrow();
			});

			it("should throw error for age below minimum", async () => {
				await expect(user.setAge(-1)).rejects.toThrow();
			});

			it("should throw error for age above maximum", async () => {
				await expect(user.setAge(151)).rejects.toThrow();
			});

			it("should allow minimum valid age", async () => {
				await expect(user.setAge(0)).resolves.not.toThrow();
			});

			it("should allow maximum valid age", async () => {
				await expect(user.setAge(150)).resolves.not.toThrow();
			});
		});
	});
});
