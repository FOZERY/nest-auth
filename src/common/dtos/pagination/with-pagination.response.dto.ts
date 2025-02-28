import { PageOptionsRequestDTO } from "./page-options.request.dto";

export interface PageMetaDTOParams {
	pageOptionsDto: PageOptionsRequestDTO;
	itemCount: number;
}

export class PageMetaDTO {
	readonly page: number;

	readonly take: number;

	readonly itemCount: number;

	readonly pageCount: number;

	readonly hasPreviousPage: boolean;

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

export class WithPaginatioResponseDTO<T> {
	readonly data: T[];
	readonly meta: PageMetaDTO;

	constructor(data: T[], meta: PageMetaDTO) {
		this.data = data;
		this.meta = meta;
	}
}
