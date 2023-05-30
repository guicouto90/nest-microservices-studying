import { Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { Desafio } from './interfaces/desafio.interface';
import { InjectModel } from '@nestjs/mongoose';
import { DesafioStatus } from './interfaces/desafio-status.enum';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class DesafiosService {
  constructor(
    @InjectModel('Desafio') private readonly desafioModel: Model<Desafio>,
  ) {}

  private readonly logger = new Logger(DesafiosService.name);

  async criarDesafio(criarDesafioDto: Desafio): Promise<Desafio> {
    try {
      const desafioCriado = new this.desafioModel(criarDesafioDto);
      /*
        Quando um desafio for criado, definimos o status desafio como pendente
        */
      desafioCriado.status = DesafioStatus.PENDENTE;
      this.logger.log(`desafioCriado: ${JSON.stringify(desafioCriado)}`);
      return await desafioCriado.save();
    } catch (error) {
      throw new RpcException(error);
    }
  }

  async consultarTodosDesafios(): Promise<Desafio[]> {
    try {
      return await this.desafioModel.find().exec();
    } catch (error) {
      throw new RpcException(error);
    }
  }

  async consultarDesafiosDeUmJogador(_id: any): Promise<Desafio[]> {
    try {
      return await this.desafioModel.find().where('jogadores').in(_id).exec();
    } catch (error) {
      throw new RpcException(error);
    }
  }

  async consultarDesafioPorId(_id: any): Promise<Desafio[]> {
    try {
      return await this.desafioModel.findById(_id);
    } catch (error) {
      throw new RpcException(error);
    }
  }

  async atualizarDesafio(
    _id: string,
    dataHoraDesafio: Date,
    status: DesafioStatus,
  ): Promise<void> {
    const desafioEncontrado = await this.desafioModel.findById(_id).exec();
    if (status) {
      desafioEncontrado.dataHoraResposta = new Date();
    }
    desafioEncontrado.status = status;
    desafioEncontrado.dataHoraDesafio = dataHoraDesafio;
    try {
      await this.desafioModel
        .findOneAndUpdate({ _id }, { $set: desafioEncontrado })
        .exec();
    } catch (error) {
      throw new RpcException(error);
    }
  }

  async atribuirDesafioPartida(
    idPartida: string,
    desafio: Desafio,
  ): Promise<void> {
    try {
      const desafioEncontrado = await this.desafioModel.findById(desafio.id);
      desafioEncontrado.partida = idPartida;
      await desafioEncontrado.save();
    } catch (error) {
      throw new RpcException(error);
    }
  }

  async deletarDesafio(_id: string): Promise<void> {
    try {
      const desafioEncontrado = await this.desafioModel.findById(_id).exec();
      /*
        Realizaremos a deleção lógica do desafio, modificando seu status para
        CANCELADO
        */
      desafioEncontrado.status = DesafioStatus.CANCELADO;

      await this.desafioModel
        .findOneAndUpdate({ _id }, { $set: desafioEncontrado })
        .exec();
    } catch (error) {
      throw new RpcException(error);
    }
  }
}
