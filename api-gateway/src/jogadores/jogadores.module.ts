import { Module } from '@nestjs/common';
import { JogadoresController } from './jogadores.controller';
import { ProxyrmqModule } from 'src/proxyrmq/proxyrmq.module';

@Module({
  controllers: [JogadoresController],
  imports: [ProxyrmqModule],
})
export class JogadoresModule {}
