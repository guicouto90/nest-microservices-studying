import { Module } from '@nestjs/common';
import { DesafiosService } from './desafios.service';
import { DesafiosController } from './desafios.controller';
import { DesafioSchema } from './interfaces/desafio.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  providers: [DesafiosService],
  controllers: [DesafiosController],
  imports: [
    MongooseModule.forFeature([{ name: 'Desafio', schema: DesafioSchema }]),
  ],
})
export class DesafiosModule {}
