import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Products } from './schema/products.schema';
import { CreateProductRequest, UpdateProductBodyRequest } from './dtos/products.input';
import { GetProductListArgs, GetProductListOrder } from './dtos/products.args';
import { GetListProductData, GetListProductOrderData, RetrieveProductOrderResponse } from './object/products.object';
import { TCP_CHANNEL_USER_SERVICE } from '../../core/commons/tcp-channel';
import { IUser } from '../../core/commons/constant';
import { TcpTransport } from '../../core/commons/tcp-transport';
@Injectable()
export class ProductsService {
  constructor(
    @InjectModel('Products') 
    private readonly model: Model<Products>,
    private readonly client: TcpTransport
  ){}

  async getProductList(query: GetProductListArgs): Promise<{data: GetListProductData[], count: number}> {
    const getProducts = await this.model.find(
      {},
      null,
      {
        skip: (query.pageSize * query.currentPage) - query.pageSize,
        limit: query.pageSize,
        sort:{[query.orderBy]: query.orderType}
      }
    );
    const count = await this.model.count();
    const response: GetListProductData[] = await Promise.all(
      getProducts.map(async product => {
        const getUpdatedBy = await this.getUserBydId(product.updatedBy)
        return {
          id: product.id,
          name: product.name,
          sku: product.sku,
          lastUpdate: getUpdatedBy.fullname,
        }
      })
    )

    return {
      data: response,
      count
    };
  }

  async createProduct(body: CreateProductRequest, createdBy: string): Promise<void> {
    if (await this.findByNameOrSku(body.name)) { // validate duplicate name
      throw new BadRequestException('Name already exist!')
    }else if (await this.findByNameOrSku(body.sku)) { // validate duplicate sku
      throw new BadRequestException('SKU already exist!')
    }
    const bodyMerge = Object.assign({},body,{createdBy: createdBy, updatedBy: createdBy})
    await new this.model({
      ...bodyMerge,
    }).save();
  }

  async updateProduct(body: UpdateProductBodyRequest, id: string, updatedBy: string): Promise<void> {
    await this.findById(id)

    const validateDuplicateName = await this.findByNameOrSku(body.name)
    if (validateDuplicateName && validateDuplicateName.id !== id)
      throw new BadRequestException('Name already exist!')

    const validateDuplicateSKU = await this.findByNameOrSku(body.sku)
    if (validateDuplicateSKU && validateDuplicateSKU.id !== id)
      throw new BadRequestException('SKU already exist!')
    
    const bodyMerge = Object.assign({},body,{updatedBy});
    await this.model.findOneAndUpdate({id},{...bodyMerge});
  }

  async deleteProduct(id: string): Promise<void> {
    await this.findById(id)
    await this.model.findByIdAndDelete(id)
  }

  private async findById(id: string): Promise<Products> {
    try {
      return await this.model.findById(id);
    } catch (error) {
      throw new BadRequestException('Product not found!')
    }
  }

  private async findByNameOrSku(value: string): Promise<Products> {
    return await this.model.findOne({
      $or:[
        {
          'name': value
        },
        {
          'sku': value
        }
      ]
    }).exec()
  }

  private async getUserBydId(id: String): Promise<IUser> {
    return await this.client.sendMessageUserService<IUser>(TCP_CHANNEL_USER_SERVICE.GET_USER_BY_ID, id);
  }

  async retrieveProductOrderService(id: string): Promise<RetrieveProductOrderResponse> {
    const getProduct = await this.findById(id);
    const response: RetrieveProductOrderResponse = {
      name: getProduct.name,
      sku: getProduct.sku,
      type: getProduct.type
    }
    return response;
  }

  async getListProductOrderService(query: GetProductListOrder): Promise<{data: GetListProductOrderData[], count: number}> {
    let globalSearch = {};
    if (query.globalSearch) {
      globalSearch = Object.assign({},{
        $or:[
          {
            name: { $regex: `.*${query.globalSearch}.*` }
          },
          {
            sku: { $regex: `.*${query.globalSearch}.*` }
          }
        ]
      })
    }
    const getProducts = await this.model.find(
      globalSearch,
      null,
      {
        skip: (query.pageSize * query.currentPage) - query.pageSize,
        limit: query.pageSize,
        sort:{[query.orderBy]: query.orderType}
      }
    );
    const count = await this.model.count();
    const response: GetListProductOrderData[] = getProducts.map(product => {
      return {
        id: product.id,
        name: product.name,
        sku: product.sku
      }
    });
    return {
      data: response,
      count: count
    }
  }
}
