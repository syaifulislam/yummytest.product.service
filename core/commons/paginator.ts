import { ArgsType, Field, Int, ObjectType } from "@nestjs/graphql";
import { IsOptional } from "class-validator";

@ArgsType()
export class PaginationArgs {
  @Field(type => Int)
  @IsOptional()
  pageSize: number = 10;

  @Field(type => Int)
  @IsOptional()
  currentPage: number = 1;
}

@ObjectType()
class PageInfo {
  @Field(type => Int)
  currentPage: number;

  @Field(type => Int)
  pageSize: number;

  @Field(type => Int)
  totalPage: number;
}

@ObjectType()
export class PaginationBaseObject {
  @Field(type => Int)
  count: number;

  @Field(type => PageInfo)
  pageInfo: PageInfo;
}