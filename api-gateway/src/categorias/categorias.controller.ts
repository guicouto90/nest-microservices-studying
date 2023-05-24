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
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import { CriarCategoriaDto } from './dtos/criar-categoria.dto';
import { Observable } from 'rxjs';
import { AtualizarCategoriaDto } from './dtos/atualizar-categoria.dto';

@Controller('categorias')
export class CategoriasController {
  private logger = new Logger(CategoriasController.name);
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
  criarCategoria(@Body() criarCategoria: CriarCategoriaDto) {
    this.clientAdminBackend.emit('criar-categoria', criarCategoria); //envia para o broker o nome do topico e o body;
  }

  @Get()
  consultarCategoria(@Query('idCategoria') _id: string): Observable<any> {
    return this.clientAdminBackend.send('consultar-categorias', _id ? _id : '');
  }

  @Put()
  @UsePipes(ValidationPipe)
  atualizarCategoria(
    @Body() atualizarCategoria: AtualizarCategoriaDto,
    @Param('_id') _id: string,
  ) {
    this.clientAdminBackend.emit('atualizar-categoria', {
      id: _id,
      categoria: atualizarCategoria,
    });
  }
}
