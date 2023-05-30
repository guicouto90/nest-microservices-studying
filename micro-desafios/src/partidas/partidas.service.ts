import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Partida } from './interfaces/partida.interface';
import { ProxyrmqService } from 'src/proxyrmq/proxyrmq.service';

@Injectable()
export class PartidasService {
  private logger = new Logger(PartidasService.name);
  constructor(
    @InjectModel('Partida') private readonly partidaModel: Model<Partida>,
    private clientProxy: ProxyrmqService,
  ) {}

  async criarPartida(partida: Partida): Promise<void> {
    try {
      const partidaCriada = new this.partidaModel(partida);
      this.logger.log(`partidaCriada: ${JSON.stringify(partidaCriada)}`);

      const result = await partidaCriada.save();
      this.logger.log(`result: ${JSON.stringify(result)}`);
      const idPartida = result._id;

      const desafio = await this.clientProxy
        .getClientProxyDesafioInstance()
        .send('consultar-desafios', { idJogador: null, _id: partida.desafio })
        .toPromise();

      this.clientProxy
        .getClientProxyDesafioInstance()
        .emit('atualizar-desafio-partida', { idPartida, desafio });
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error)}`);
    }
  }
}
