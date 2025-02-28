import { IsEnum, IsInt, IsOptional, Max, Min } from "class-validator";

export enum Order {
	ASC = "ASC",
	DESC = "DESC",
}

export class PageOptionsRequestDTO {
	@IsEnum(Order)
	@IsOptional()
	readonly order?: Order = Order.ASC;

	@IsInt()
	@Min(1)
	@IsOptional()
	readonly page?: number = 1;

	@IsInt()
	@Min(1)
	@Max(50)
	@IsOptional()
	readonly take?: number = 10;

	get skip(): number {
		return (this.page! - 1) * this.take!;
	}
}
