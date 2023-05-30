import { Controller, Logger } from '@nestjs/common';
import { DesafiosService } from './desafios.service';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { Desafio } from './interfaces/desafio.interface';
const ackErrors: string[] = ['E11000'];

@Controller()
export class DesafiosController {
  logger = new Logger(DesafiosController.name);
  constructor(private readonly desafioService: DesafiosService) {}

  @EventPattern('criar-desafio')
  async criarJogador(@Payload() desafio: Desafio, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      this.logger.log(`desafio: ${JSON.stringify(desafio)}`);
      await this.desafioService.criarDesafio(desafio);
      await channel.ack(originalMsg);
    } catch (error) {
      this.logger.log(`error: ${JSON.stringify(error.message)}`);
      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError.length > 0) {
        await channel.ack(originalMsg);
      }
    }
  }

  @MessagePattern('consultar-desafios')
  async consultarJogadores(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      if (data._id) {
        return await this.desafioService.consultarDesafioPorId(data._id);
      } else if (data.idJogador) {
        return await this.desafioService.consultarDesafiosDeUmJogador(
          data.idJogador,
        );
      } else {
        return await this.desafioService.consultarTodosDesafios();
      }
    } finally {
      await channel.ack(originalMsg);
    }
  }
  @EventPattern('atualizar-desafio')
  async atualizarJogador(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      console.log(`data: ${JSON.stringify(data)}`);
      await this.desafioService.atualizarDesafio(
        data._id,
        data.dataHoraDesafio,
        data.status,
      );
      await channel.ack(originalMsg);
    } catch (error) {
      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );
      if (filterAckError.length > 0) {
        await channel.ack(originalMsg);
      }
    }
  }

  @EventPattern('atualizar-desafio-partida')
  async uploadFotoJogador(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      console.log(`data: ${JSON.stringify(data)}`);
      await this.desafioService.atribuirDesafioPartida(
        data.idPartida,
        data.desafio,
      );
      await channel.ack(originalMsg);
    } catch (error) {
      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );
      if (filterAckError.length > 0) {
        await channel.ack(originalMsg);
      }
    }
  }

  @EventPattern('deletar-desafio')
  async deletarJogador(@Payload() _id: string, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();
    try {
      await this.desafioService.deletarDesafio(_id);
      await channel.ack(originalMsg);
    } catch (error) {
      const filterAckError = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );

      if (filterAckError.length > 0) {
        await channel.ack(originalMsg);
      }
    }
  }
}
