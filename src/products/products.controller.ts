import { Controller } from '@nestjs/common';
import { ProductsService } from './products.service';
import { GetProductListOrder } from './dtos/products.args';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { TCP_CHANNEL } from '../../core/commons/tcp-channel';
import { GetListProductOrderResponse, RetrieveProductOrderResponse } from './object/products.object';
@Controller()
export class ProductsController {
  constructor(private readonly service: ProductsService){}

  @MessagePattern(TCP_CHANNEL.GET_PRODUCT_LIST)
  async getProductListOrder(@Payload() query: GetProductListOrder): Promise<GetListProductOrderResponse>{
    const {data,count} = await this.service.getListProductOrderService(query)
    return {
      data,
      count,
      pageInfo:{
        currentPage: query.currentPage,
        pageSize: query.pageSize,
        totalPage: count % query.pageSize
      }
    }
  }


  @MessagePattern(TCP_CHANNEL.GET_PRODUCT_BY_ID)
  async retrieveProductOrder(@Payload() id: string): Promise<RetrieveProductOrderResponse> {
    return await this.service.retrieveProductOrderService(id)
  }
  
}
