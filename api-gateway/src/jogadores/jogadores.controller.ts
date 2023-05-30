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
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CriarJogadorDto } from './dtos/criar-jogador.dto';
import { AtualizarJogadorDto } from './dtos/atualizar-jogador.dto';
import { ClientProxySmartRanking } from 'src/proxyrmq/client-proxy';
import { FileInterceptor } from '@nestjs/platform-express';
import { AwsService } from 'src/aws/aws.service';

@Controller('jogadores')
export class JogadoresController {
  private logger = new Logger(JogadoresController.name);

  constructor(
    private clientAdminBackend: ClientProxySmartRanking,
    private awsService: AwsService,
  ) {}

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

  @Post('/:id/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadArquivo(@UploadedFile() file: any, @Param('id') _id: string) {
    //Verifica se o jogador existe
    const jogadorExiste = await this.clientAdminBackend
      .getClientProxyAdminBackendInstance()
      .send('consultar-jogadores', _id)
      .toPromise();
    if (!jogadorExiste) throw new NotFoundException('Jogador não encontrado');

    // Upload do arquivo
    const { url } = await this.awsService.uploadArquivoS3(file, _id);
    this.logger.log(url);

    // Manda para o broker o topico de upload jogador, com o id do jogador + url da AWS
    this.clientAdminBackend
      .getClientProxyAdminBackendInstance()
      .emit('upload-foto-jogador', {
        id: _id,
        url,
      });

    // Retornar objeto da collection jogador atualizado.
    return this.clientAdminBackend
      .getClientProxyAdminBackendInstance()
      .send('consultar-jogadores', _id);
  }
}
