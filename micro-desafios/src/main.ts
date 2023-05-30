import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';

const logger = new Logger('Main');

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.AMQP_URL],
      queue: 'desafios',
      noAck: false, //RabbitMQ so deleta a mensagem no broker depois que devolvermos um "OK" para ele
    },
  });

  await app.listen();
  logger.log('Microservice is listening');
}
bootstrap();
