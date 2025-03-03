import { applyDecorators, Type } from "@nestjs/common";
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from "@nestjs/swagger";
import { WithPaginatioResponseDTO } from "../../../common/dtos/pagination/with-pagination.response.dto";

export const ApiPaginatedOkResponse = <TModel extends Type<any>>(model: TModel) => {
	return applyDecorators(
		ApiExtraModels(WithPaginatioResponseDTO, model),
		ApiOkResponse({
			description: "Успешно получены данные",
			schema: {
				allOf: [
					{ $ref: getSchemaPath(WithPaginatioResponseDTO) },
					{
						properties: {
							data: {
								type: "array",
								items: { $ref: getSchemaPath(model) },
							},
						},
					},
				],
			},
		})
	);
};
