import { Field, ID, ObjectType } from "@nestjs/graphql";
import { PaginationBaseObject } from '../../../core/commons/paginator';
export enum ProductTypes {
  BODYSUIT = 'BODYSUIT',
  CARDIGAN = 'CARDIGAN',
  JACKET = 'JACKET',
  JEANS = 'JEANS'
}

@ObjectType()
export class CreatedProductObject {
  @Field()
  success: boolean;
}

@ObjectType()
export class UpdatedProductObject {
  @Field()
  success: boolean;
}

@ObjectType()
export class DeletedProductObject {
  @Field()
  success: boolean;
}

@ObjectType()
export class GetListProductObject extends PaginationBaseObject {
  @Field(type => [GetListProductData], { nullable: true })
  data: GetListProductData[]
}

@ObjectType()
export class GetListProductData {
  @Field()
  id: String;

  @Field()
  name: String;

  @Field()
  sku: String;

  @Field()
  lastUpdate: String;
}

export class GetListProductOrderResponse extends PaginationBaseObject {
  @Field(type => [GetListProductOrderData], { nullable: true })
  data: GetListProductOrderData[]
}

export class GetListProductOrderData {
  id: String;
  name: String;
  sku: String;
}

export class RetrieveProductOrderResponse {
  name: String;
  sku: String;
  type: String;
}
