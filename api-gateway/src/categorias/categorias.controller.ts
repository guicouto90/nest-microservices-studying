import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CriarCategoriaDto } from './dtos/criar-categoria.dto';
import { Observable } from 'rxjs';
import { AtualizarCategoriaDto } from './dtos/atualizar-categoria.dto';
import { ClientProxySmartRanking } from 'src/proxyrmq/client-proxy';

@Controller('categorias')
export class CategoriasController {
  private logger = new Logger(CategoriasController.name);

  constructor(private clientAdminBackend: ClientProxySmartRanking) {}

  @Post()
  @UsePipes(ValidationPipe)
  criarCategoria(@Body() criarCategoria: CriarCategoriaDto) {
    this.clientAdminBackend
      .getClientProxyAdminBackendInstance()
      .emit('criar-categoria', criarCategoria); //envia para o broker o nome do topico e o body;
  }

  @Get()
  consultarCategoria(@Query('idCategoria') _id: string): Observable<any> {
    return this.clientAdminBackend
      .getClientProxyAdminBackendInstance()
      .send('consultar-categorias', _id ? _id : '');
  }

  @Put()
  @UsePipes(ValidationPipe)
  atualizarCategoria(
    @Body() atualizarCategoria: AtualizarCategoriaDto,
    @Param('_id') _id: string,
  ) {
    this.clientAdminBackend
      .getClientProxyAdminBackendInstance()
      .emit('atualizar-categoria', {
        id: _id,
        categoria: atualizarCategoria,
      });
  }
}
