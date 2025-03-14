import { GetUserResponseDTO } from "../responses/get-user.response.dto";

export interface FindAllUsersWithPaginationInputDTO {
	login?: string;
	take: number;
	skip: number;
	orderBy: "asc" | "desc";
}

export interface FindAllUsersWithPaginationOutputDTO {
	data: GetUserResponseDTO[];
	total: number;
}
