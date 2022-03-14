import { Field, InputType, ArgsType, Int } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';
import { PaginationArgs } from '../../../core/commons/paginator'

@ArgsType()
export class GetProductListArgs extends PaginationArgs {
  @Field()
  @IsOptional()
  orderType: string = 'asc'

  @Field()
  @IsOptional()
  orderBy: string = 'name'
}

export class GetProductListOrder extends PaginationArgs {
  @IsOptional()
  globalSearch: string;

  @IsOptional()
  orderType: string = 'asc'

  @IsOptional()
  orderBy: string = 'name'
}