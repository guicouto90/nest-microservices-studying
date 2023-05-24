import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

const logger = new Logger('Main');

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://guicouto:123456@54.221.95.76:5672/smartranking'],
      queue: 'admin-backend',
      noAck: false, //RabbitMQ so deleta a mensagem no broker depois que devolvermos um "OK" para ele
    },
  });

  await app.listen();
  logger.log('Microservice is listening');
}
bootstrap();
