import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  EventPattern,
  MessagePattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { Jogador } from './interfaces/jogador.interface';
import { JogadoresService } from './jogadores.service';

const ackErrors: string[] = ['E11000'];

@Controller('jogadores')
export class JogadoresController {
  constructor(private readonly jogadorService: JogadoresService) {}

  private logger = new Logger(JogadoresController.name);

  @EventPattern('criar-jogador') //event listener
  async criarJogador(@Payload() jogador: Jogador, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef(); // canal de referencia do RabbitMQ
    const originalMessage = context.getMessage(); // mensagem original

    this.logger.log(`jogador: ${JSON.stringify(jogador)}`);
    try {
      await this.jogadorService.criarJogador(jogador);
      await channel.ack(originalMessage);
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error)}`);
      const [filterAckError] = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );
      if (filterAckError) await channel.ack(originalMessage);
    }
  }

  @MessagePattern('consultar-jogadores')
  async consultarJogadores(
    @Payload() _id: string,
    @Ctx() context: RmqContext,
  ): Promise<Jogador[] | Jogador> {
    const channel = context.getChannelRef(); // canal de referencia do RabbitMQ
    const originalMessage = context.getMessage(); // mensagem original
    try {
      if (_id) {
        return this.jogadorService.consultarJogadorPeloId(_id);
      } else {
        return this.jogadorService.consultarTodosJogadores();
      }
    } finally {
      await channel.ack(originalMessage);
    }
  }

  @EventPattern('atualizar-jogador') //event listener
  async atualizarJogador(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef(); // canal de referencia do RabbitMQ
    const originalMessage = context.getMessage(); // mensagem original

    this.logger.log(`jogador: ${JSON.stringify(data)}`);
    try {
      await this.jogadorService.atualizarJogador(data.id, data.jogador);
      await channel.ack(originalMessage);
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error)}`);
      const [filterAckError] = ackErrors.filter((ackError) =>
        error.message.includes(ackError),
      );
      if (filterAckError) await channel.ack(originalMessage);
    }
  }

  @EventPattern('deletar-jogador') //event listener
  async deletarJogador(@Payload() data: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef(); // canal de referencia do RabbitMQ
    const originalMessage = context.getMessage(); // mensagem original

    this.logger.log(`jogador: ${JSON.stringify(data)}`);
    try {
      await this.jogadorService.deletarJogador(data.id);
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
