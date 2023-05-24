import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { AtualizarJogadorDto } from './dtos/atualizar-jogador.dto';
import { ClientProxySmartRanking } from 'src/proxyrmq/client-proxy';

@Controller('jogadores')
export class JogadoresController {
  private logger = new Logger(JogadoresController.name);

  constructor(private clientAdminBackend: ClientProxySmartRanking) {}

  @Post()
  @UsePipes(ValidationPipe)
  async criarJogador(@Body() criarJogadorDto: CriarJogadorDto) {
    const categoria = await this.clientAdminBackend
      .getClientProxyAdminBackendInstance()
      .send('consultar-categorias', criarJogadorDto.categoria)
      .toPromise();
    if (categoria) {
      this.clientAdminBackend
        .getClientProxyAdminBackendInstance()
        .emit('criar-jogador', criarJogadorDto);
    } else {
      throw new NotFoundException('Categoria não encontrada');
    }
  }

  @Put('/:_id')
  @UsePipes(ValidationPipe)
  async atualizarJogador(
    @Body() atualizarJogadorDto: AtualizarJogadorDto,
    @Param('_id') _id: string,
  ) {
    const categoria = await this.clientAdminBackend
      .getClientProxyAdminBackendInstance()
      .send('consultar-categorias', atualizarJogadorDto.categoria)
      .toPromise();
    if (categoria) {
      this.clientAdminBackend
        .getClientProxyAdminBackendInstance()
        .emit('atualizar-jogador', {
          id: _id,
          jogador: atualizarJogadorDto,
        });
    } else {
      throw new NotFoundException('Categoria não encontrada');
    }
  }

  /*
    Desafio
    Passamos a utilizar query parameters com o verbo GET
    */

  @Get()
  async consultarJogadores(@Query('idJogador') _id: string): Promise<any> {
    return this.clientAdminBackend
      .getClientProxyAdminBackendInstance()
      .send('consultar-jogadores', _id ? _id : '');
  }

  @Delete('/:_id')
  async deletarJogador(@Param('_id') _id: string) {
    this.clientAdminBackend
      .getClientProxyAdminBackendInstance()
      .emit('deletar-jogador', {
        id: _id,
      });
  }
}
