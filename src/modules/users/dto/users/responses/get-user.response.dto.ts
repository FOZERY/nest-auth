import { Nullable } from "../../../../../core/types/utility.types";

export class GetUserResponseDTO {
	id: string;
	login: string;
	age: number;
	about: Nullable<string>;
}
