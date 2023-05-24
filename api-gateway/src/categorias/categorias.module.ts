import { Module } from '@nestjs/common';
import { CategoriasController } from './categorias.controller';
import { ProxyrmqModule } from 'src/proxyrmq/proxyrmq.module';

@Module({
  controllers: [CategoriasController],
  imports: [ProxyrmqModule],
})
export class CategoriasModule {}
