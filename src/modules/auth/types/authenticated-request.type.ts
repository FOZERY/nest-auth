import { Request } from "express";

export type AuthenticatedRequestUser = {
	id: string;
	login: string;
	email: string;
};

export interface AuthenticatedRequest extends Request {
	user: AuthenticatedRequestUser;
}
