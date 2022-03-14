import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtStrategy } from 'core/guard/jwt.strategy';
import { ProductsResolver } from './products.resolver';
import { ProductsService } from './products.service';
import { ProductsSchema } from './schema/products.schema';
import { ProductsController } from './products.controller';
import { TcpTransport } from '../../core/commons/tcp-transport';
@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: 'Products', schema: ProductsSchema }]),
    JwtModule.registerAsync({
      imports:[ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_KEY'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION_TIME')
        }
      }),
    }),
  ],
  providers: [
    TcpTransport,
    ProductsResolver, 
    ProductsService, 
    JwtStrategy,
    {
      provide: 'USER_SERVICE',
      inject:[ConfigService],
      useFactory:  async (configService: ConfigService) =>
        ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('TCP_USER_SERVICE_HOST'),
            port: configService.get<number>('TCP_USER_SERVICE_PORT')
          },
      }),
    },
  ],
  controllers: [ProductsController]
})
export class ProductsModule {}
