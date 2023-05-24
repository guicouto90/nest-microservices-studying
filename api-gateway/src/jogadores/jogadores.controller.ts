import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { AtualizarJogadorDto } from './dtos/atualizar-jogador.dto';

@Controller('jogadores')
export class JogadoresController {
  private logger = new Logger(JogadoresController.name);
  private clientAdminBackend: ClientProxy;

  constructor() {
    this.clientAdminBackend = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://guicouto:123456@54.221.95.76:5672/smartranking'],
        queue: 'admin-backend',
      },
    });
  }

  @Post()
  @UsePipes(ValidationPipe)
  async criarJogador(@Body() criarJogadorDto: CriarJogadorDto) {
    this.clientAdminBackend.emit('criar-jogador', criarJogadorDto);
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async atualizarJogador(
    @Body() atualizarJogadorDto: AtualizarJogadorDto,
    @Param('_id') _id: string,
  ) {
    this.clientAdminBackend.emit('atualizar-jogador', {
      id: _id,
      categoria: atualizarJogadorDto,
    });
  }

  /*
    Desafio
    Passamos a utilizar query parameters com o verbo GET
    */

  @Get()
  async consultarJogadores(@Query('idJogador') _id: string): Promise<any> {
    return this.clientAdminBackend.send('consultar-jogadores', _id ? _id : '');
  }

  /*
    @Get('/:_id')
    async consultarJogadorPeloId(
        @Param('_id', ValidacaoParametrosPipe) _id: string): Promise<Jogador> {
                return await this.jogadoresService.consultarJogadorPeloId(_id);    
    }
    */

  @Delete('/:_id')
  async deletarJogador(@Param('_id') _id: string) {
    this.clientAdminBackend.emit('deletar-jogador', {
      id: _id,
    });
  }
}
