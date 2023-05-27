import { Module } from '@nestjs/common';
import { CategoriasModule } from './categorias/categorias.module';
import { JogadoresModule } from './jogadores/jogadores.module';
import { TimeoutInterceptor } from './common/interceptors/timeout.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { ProxyrmqModule } from './proxyrmq/proxyrmq.module';
import { ConfigModule } from '@nestjs/config';
import { AwsModule } from './aws/aws.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env' }),
    CategoriasModule,
    JogadoresModule,
    ProxyrmqModule,
    AwsModule,
  ],
  controllers: [],
  providers: [TimeoutInterceptor, LoggingInterceptor],
})
export class AppModule {}
