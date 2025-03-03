import { ApiProperty } from "@nestjs/swagger";
import { IsArray } from "class-validator";
import { PageOptionsRequestDTO } from "./page-options.request.dto";

export interface PageMetaDTOParams {
	pageOptionsDto: PageOptionsRequestDTO;
	itemCount: number;
}

export class PageMetaDTO {
	@ApiProperty({
		description: "Текущая страница",
		example: 1,
	})
	readonly page: number;

	@ApiProperty({
		description: "Количество элементов на странице",
		example: 10,
	})
	readonly take: number;

	@ApiProperty({
		description: "Общее количество элементов",
		example: 100,
	})
	readonly itemCount: number;

	@ApiProperty({
		description: "Общее количество страниц",
		example: 10,
	})
	readonly pageCount: number;

	@ApiProperty({
		description: "Есть ли предыдущая страница",
		example: false,
	})
	readonly hasPreviousPage: boolean;

	@ApiProperty({
		description: "Есть ли следующая страница",
		example: true,
	})
	readonly hasNextPage: boolean;

	constructor({ pageOptionsDto, itemCount }: PageMetaDTOParams) {
		this.page = pageOptionsDto.page!;
		this.take = pageOptionsDto.take!;
		this.itemCount = itemCount;
		this.pageCount = Math.ceil(this.itemCount / this.take);
		this.hasPreviousPage = this.page > 1;
		this.hasNextPage = this.page < this.pageCount;
	}
}

export class WithPaginationResponseDTO<T> {
	@IsArray()
	@ApiProperty({
		description: "Данные для пагинации",
		isArray: true,
	})
	data: T[];

	@ApiProperty({ type: () => PageMetaDTO })
	meta: PageMetaDTO;

	constructor(data: T[], meta: PageMetaDTO) {
		this.data = data;
		this.meta = meta;
	}
}
