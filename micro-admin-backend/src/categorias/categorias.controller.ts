import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { CategoriasService } from './categorias.service';
import { Controller, Logger } from '@nestjs/common';
import { Categoria } from './interfaces/categoria.interface';

const ackErrors: string[] = ['E11000'];

@Controller('categorias')
export class CategoriasController {
  constructor(private readonly categoriasService: CategoriasService) {}

  private logger = new Logger(CategoriasController.name);

  @EventPattern('criar-categoria') //event listener
  async criarCategoria(
    @Payload() categoria: Categoria,
    @Ctx() context: RmqContext,
  ) {
    const channel = context.getChannelRef(); // canal de referencia do RabbitMQ
    const originalMessage = context.getMessage(); // mensagem original

    this.logger.log(`categoria: ${JSON.stringify(categoria)}`);
    try {
      await this.categoriasService.criarCategoria(categoria);
      await channel.ack(originalMessage);
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error)}`);
      const [filterAckError] = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );
      if (filterAckError) await channel.ack(originalMessage);
    }
  }

  @MessagePattern('consultar-categorias')
  async consultarCategorias(
    @Payload() _id: string,
    @Ctx() context: RmqContext,
  ): Promise<Categoria[] | Categoria> {
    const channel = context.getChannelRef(); // canal de referencia do RabbitMQ
    const originalMessage = context.getMessage(); // mensagem original
    try {
      if (_id) {
        return this.categoriasService.consultarCategoriaPorId(_id);
      } else {
        return this.categoriasService.consultarTodasCategorias();
      }
    } finally {
      await channel.ack(originalMessage);
    }
  }

  @EventPattern('atualizar-categoria') //event listener
  async atualizarCategoria(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef(); // canal de referencia do RabbitMQ
    const originalMessage = context.getMessage(); // mensagem original

    this.logger.log(`categoria: ${JSON.stringify(data)}`);
    try {
      await this.categoriasService.atualizarCategoria(data.id, data.categoria);
      await channel.ack(originalMessage);
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error)}`);
      const [filterAckError] = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );
      if (filterAckError) await channel.ack(originalMessage);
    }
  }
}
