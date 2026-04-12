import { applyDecorators, Type } from "@nestjs/common";
import { ApiOperation, ApiQuery, ApiResponse } from "@nestjs/swagger";

export function ApiPaginatedResponse<TModel extends Type<any>>(
  model: TModel,
  operationSummary: string,
) {
  return applyDecorators(
    ApiOperation({ summary: operationSummary }),
    ApiQuery({ name: "page", required: false, type: Number }),
    ApiQuery({ name: "limit", required: false, type: Number }),
    ApiResponse({
      status: 200,
      description: `${model.name} list retrieved successfully`,
      type: model,
    }),
  );
}

export function ApiSingleResponse<TModel extends Type<any>>(
  model: TModel,
  operationSummary: string,
) {
  return applyDecorators(
    ApiOperation({ summary: operationSummary }),
    ApiResponse({
      status: 200,
      description: `${model.name} retrieved successfully`,
      type: model,
    }),
  );
}

export function ApiCreatedResponse<TModel extends Type<any>>(
  model: TModel,
  operationSummary: string,
) {
  return applyDecorators(
    ApiOperation({ summary: operationSummary }),
    ApiResponse({
      status: 201,
      description: `${model.name} created successfully`,
      type: model,
    }),
  );
}
