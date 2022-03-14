import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { ProductsService } from './products.service';
import { CreatedProductObject, GetListProductObject, UpdatedProductObject, DeletedProductObject } from './object/products.object';
import { UseGuards, UseInterceptors } from '@nestjs/common';
import { GqlAuthGuard, CurrentUser } from 'core/guard/roles.guard';
import { CreateProductRequest, UpdateProductBodyRequest } from './dtos/products.input';
import { Roles, UsersRole } from 'core/decorator/roles.decorator';
import { AuthTokenUser } from '../../core/guard/jwt.strategy';
import { GetProductListArgs } from './dtos/products.args';
import { PaginationInterceptor } from '../../core/interceptor/pagination.interceptor';
@Resolver('Products')
export class ProductsResolver {
  constructor(private readonly service: ProductsService){}

  @Mutation(returns => CreatedProductObject)
  @UseGuards(GqlAuthGuard)
  @Roles(UsersRole.ADMIN)
  async createProduct(
    @Args('input') args: CreateProductRequest, 
    @CurrentUser() user: AuthTokenUser
  ): Promise<CreatedProductObject> {
    const { id } = user
    await this.service.createProduct(args, id)
    return {
      success: true
    };
  }

  @Query(returns => GetListProductObject)
  @UseGuards(GqlAuthGuard)
  @Roles(UsersRole.ADMIN)
  @UseInterceptors(PaginationInterceptor)
  async getListProducts(@Args() query: GetProductListArgs): Promise<GetListProductObject> {
    const {data,count} = await this.service.getProductList(query);
    return {
      data: data,
      count: count,
      pageInfo: {
        currentPage: query.currentPage,
        pageSize: query.pageSize,
        totalPage: count % query.pageSize
      }
    }
  }

  @Mutation(returns => UpdatedProductObject)
  @UseGuards(GqlAuthGuard)
  @Roles(UsersRole.ADMIN)
  async updateProduct(
    @Args('input') args: UpdateProductBodyRequest,
    @Args('id') productId: string,
    @CurrentUser() user: AuthTokenUser
  ): Promise<UpdatedProductObject> {
    const { id } = user
    await this.service.updateProduct(args, productId, id)
    return {
      success: true
    }
  }

  @Mutation(returns => DeletedProductObject)
  @UseGuards(GqlAuthGuard)
  @Roles(UsersRole.ADMIN)
  async deleteProduct(
    @Args('id') productId: string
  ): Promise<DeletedProductObject> {
    await this.service.deleteProduct(productId)
    return {
      success: true
    }
  }
}
