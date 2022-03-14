import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  
  const configService = app.get(ConfigService)
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: {
      port: configService.get('TCP_MICROSERVICE_PORT'),
      retryDelay: 3000,
      retryAttempts: 3
    }
  });
  await app.startAllMicroservices();
  await app.listen(configService.get('PORT'), configService.get('HOST'));
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
