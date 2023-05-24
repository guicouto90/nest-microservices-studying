import { Module } from '@nestjs/common';
import { TimeoutInterceptor } from './interceptors/timeout.interceptor';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { CategoriasModule } from './categorias/categorias.module';
import { JogadoresModule } from './jogadores/jogadores.module';

@Module({
  imports: [CategoriasModule, JogadoresModule],
  controllers: [],
  providers: [TimeoutInterceptor, LoggingInterceptor],
})
export class AppModule {}
