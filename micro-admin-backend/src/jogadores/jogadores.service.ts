import { Injectable, Logger } from '@nestjs/common';
import { Jogador } from './interfaces/jogador.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class JogadoresService {
  constructor(
    @InjectModel('Jogador') private readonly jogadorModel: Model<Jogador>,
  ) {}

  private readonly logger = new Logger(JogadoresService.name);

  async criarJogador(criaJogadorDto: Jogador): Promise<Jogador> {
    const { email } = criaJogadorDto;

    const jogadorEncontrado = await this.jogadorModel.findOne({ email }).exec();

    if (jogadorEncontrado) {
      throw new RpcException(`Jogador com e-mail ${email} já cadastrado`);
    }

    const jogadorCriado = new this.jogadorModel(criaJogadorDto);
    return await jogadorCriado.save();
  }

  async atualizarJogador(
    _id: string,
    atualizarJogadorDto: Jogador,
  ): Promise<void> {
    try {
      const jogadorEncontrado = await this.jogadorModel.findOne({ _id }).exec();
      if (!jogadorEncontrado) {
        throw new RpcException(`Jogadodor com id ${_id} não econtrado`);
      }
      await this.jogadorModel
        .findOneAndUpdate({ _id }, { $set: atualizarJogadorDto })
        .exec();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async consultarTodosJogadores(): Promise<Jogador[]> {
    try {
      return await this.jogadorModel.find().exec();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async consultarJogadorPeloId(_id: string): Promise<Jogador> {
    try {
      const jogadorEncontrado = await this.jogadorModel.findOne({ _id }).exec();

      if (!jogadorEncontrado) {
        throw new RpcException(`Jogador com id ${_id} não encontrado`);
      }

      return jogadorEncontrado;
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }

  async deletarJogador(_id): Promise<any> {
    try {
      const jogadorEncontrado = await this.jogadorModel.findOne({ _id }).exec();

      if (!jogadorEncontrado) {
        throw new RpcException(`Jogador com id ${_id} não encontrado`);
      }

      return await this.jogadorModel.deleteOne({ _id }).exec();
    } catch (error) {
      this.logger.error(`error: ${JSON.stringify(error.message)}`);
      throw new RpcException(error.message);
    }
  }
}
