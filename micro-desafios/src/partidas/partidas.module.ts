import { Module } from '@nestjs/common';
import { PartidasController } from './partidas.controller';
import { PartidasService } from './partidas.service';
import { ProxyrmqModule } from 'src/proxyrmq/proxyrmq.module';
import { PartidaSchema } from './interfaces/partida.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [PartidasController],
  providers: [PartidasService],
  imports: [
    ProxyrmqModule,
    MongooseModule.forFeature([{ name: 'Partida', schema: PartidaSchema }]),
  ],
})
export class PartidasModule {}
