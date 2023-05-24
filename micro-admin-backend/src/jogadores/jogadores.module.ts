import { Module } from '@nestjs/common';
import { JogadoresService } from './jogadores.service';
import { JogadoresController } from './jogadores.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JogadorSchema } from './interfaces/jogador.schema';
import { CategoriaSchema } from 'src/categorias/interfaces/categoria.schema';

@Module({
  providers: [JogadoresService],
  controllers: [JogadoresController],
  exports: [JogadoresModule],
  imports: [
    MongooseModule.forFeature([
      { name: 'Jogador', schema: JogadorSchema },
      { name: 'Categoria', schema: CategoriaSchema },
    ]),
  ],
})
export class JogadoresModule {}
