import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpStatus,
  ParseIntPipe,
  Post,
  Query,
  Res,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { OrderService } from "./order.service";
import { ResponseService } from "../../services/response/response.service";
import { CreateOrderDTO } from "./order.dto";
import type { Response } from "express";
import {
  ApiCreatedResponse,
  ApiPaginatedResponse,
} from "../../common/decorators/swagger.decorator";
import { PaginatedOrderResponse } from "./model/orderResponse.model";

@ApiTags("Order")
@Controller("")
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly responseService: ResponseService,
  ) {}

  @Post()
  @ApiCreatedResponse(CreateOrderDTO, "Order created successfully")
  async createOrder(@Body() orderDto: CreateOrderDTO, @Res() res: Response) {
    await this.orderService.createOrder(orderDto);
    return this.responseService.success(res, HttpStatus.CREATED, "Order created successfully");
  }

  @Get()
  @ApiPaginatedResponse(PaginatedOrderResponse, "Get a paginated list of products")
  async getOrders(
    @Query("page", new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query("limit", new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Res() res: Response,
  ) {
    const orders = await this.orderService.getOrders(page, limit);
    return this.responseService.success(
      res,
      HttpStatus.OK,
      "Orders retrieved successfully",
      orders,
    );
  }
}
