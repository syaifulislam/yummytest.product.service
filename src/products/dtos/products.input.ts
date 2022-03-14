import { Field, InputType } from '@nestjs/graphql';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { ProductTypes } from '../object/products.object';

@InputType()
export class CreateProductRequest {
  @Field({ nullable: false })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field({ nullable: false })
  @IsNotEmpty()
  @IsString()
  sku: string;

  @Field({ nullable: false })
  @IsNotEmpty()
  @IsEnum(ProductTypes)
  type: ProductTypes;
}

@InputType()
export class UpdateProductBodyRequest {
  @Field({ nullable: false })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field({ nullable: false })
  @IsNotEmpty()
  @IsString()
  sku: string;

  @Field({ nullable: false })
  @IsNotEmpty()
  @IsEnum(ProductTypes)
  type: ProductTypes;
}

